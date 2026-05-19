const FlightBooking = require('../model/FlightBooking');
const { createNotification } = require('./notificationController');
const { sendMail, getEmailCredentials } = require('../utils/mailTransporter');

const sendBookingMail = (mailOptions) => {
    const { user } = getEmailCredentials();
    return sendMail({
        from: mailOptions.from || `"AI Trip Planner" <${user}>`,
        to: mailOptions.to,
        subject: mailOptions.subject,
        html: mailOptions.html,
    });
};

// Create flight booking and send confirmation email
exports.createFlightBooking = async (req, res) => {
    try {
        const {
            flightId,
            airline,
            airlineName,
            from,
            to,
            departure,
            arrival,
            departureDate,
            arrivalDate,
            duration,
            price,
            currency,
            passengerName,
            passengerEmail,
            passengerPhone,
            numberOfPassengers,
            bookingUrl,
            bookingReference, // User entered this from airline site
            // Additional airline data
            flightNumber,
            aircraft,
            cabinClass,
            baggageAllowance,
            numberOfStops,
            terminal,
            gate,
            amenities,
            country,
            rating
        } = req.body;

        // Get user ID from auth middleware (if available)
        const userId = req.user?.id || req.body.userId;

        if (!userId) {
            return res.status(401).json({ message: 'User authentication required' });
        }

        // Create booking with all airline data
        const booking = await FlightBooking.create({
            userId,
            flightId,
            airline,
            airlineName,
            from,
            to,
            departure,
            arrival,
            departureDate,
            arrivalDate,
            duration,
            price,
            currency,
            passengerName,
            passengerEmail,
            passengerPhone,
            numberOfPassengers,
            bookingReference,
            bookingUrl,
            status: 'confirmed',
            // Additional airline data
            flightNumber,
            aircraft,
            cabinClass,
            baggageAllowance,
            numberOfStops,
            terminal,
            gate,
            amenities: amenities ? (typeof amenities === 'string' ? amenities : JSON.stringify(amenities)) : null,
            country,
            rating
        });

        console.log('✅ Booking created successfully');
        console.log('📧 Attempting to send confirmation email to:', booking.passengerEmail);

        // Send confirmation email
        const emailSent = await sendBookingConfirmationEmail(booking);

        if (emailSent) {
            console.log('✅ Confirmation email sent successfully to:', booking.passengerEmail);
        } else {
            console.log('⚠️ Confirmation email failed but booking was created');
        }

        await createNotification(
            userId,
            'Flights',
            '✈️',
            'Flight booking confirmed',
            `${from} → ${to} on ${departureDate || departure || 'your selected date'}. Ref: ${bookingReference || booking.id?.slice(0, 8) || 'confirmed'}.`
        );

        res.status(201).json({
            message: 'Flight booked successfully! Confirmation email sent.',
            booking: booking
        });

    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({
            message: 'Error creating booking',
            error: error.message
        });
    }
};

// Get user's flight bookings
exports.getUserBookings = async (req, res) => {
    try {
        const userId = req.user?.id || req.params.userId;

        const bookings = await FlightBooking.findAll({
            where: { userId },
            order: [['createdAt', 'DESC']]
        });

        res.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings' });
    }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
    try {
        const booking = await FlightBooking.findByPk(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.json(booking);
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ message: 'Error fetching booking' });
    }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
    try {
        console.log('🔄 Cancel booking request received for ID:', req.params.id);
        const booking = await FlightBooking.findByPk(req.params.id);

        if (!booking) {
            console.log('❌ Booking not found:', req.params.id);
            return res.status(404).json({ message: 'Booking not found' });
        }

        console.log('✅ Booking found:', {
            id: booking.id,
            reference: booking.bookingReference,
            passenger: booking.passengerName,
            email: booking.passengerEmail
        });

        const { cancellationReason } = req.body;

        booking.status = 'cancelled';
        booking.cancellationReason = cancellationReason || 'No reason provided';
        booking.cancelledAt = new Date();
        await booking.save();

        console.log('✅ Booking status updated to cancelled');
        console.log('📧 Attempting to send cancellation email to:', booking.passengerEmail);

        // Send cancellation email
        const emailSent = await sendCancellationEmail(booking);

        if (emailSent) {
            console.log('✅ Cancellation email sent successfully to:', booking.passengerEmail);
        } else {
            console.log('⚠️ Cancellation email failed but booking was cancelled');
        }

        res.json({
            message: 'Booking cancelled successfully. Cancellation email sent.',
            booking
        });
    } catch (error) {
        console.error('❌ Error cancelling booking:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ message: 'Error cancelling booking' });
    }
};

// Delete a specific booking
exports.deleteBooking = async (req, res) => {
    console.log('Backend: deleteBooking called for ID:', req.params.id);
    try {
        const booking = await FlightBooking.findByPk(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        await booking.destroy();
        res.json({ message: 'Booking deleted from history' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Error deleting booking' });
    }
};

// Delete all bookings for a user
exports.deleteAllUserBookings = async (req, res) => {
    console.log('Backend: deleteAllUserBookings called for user:', req.params.userId);
    try {
        const userId = req.user?.id || req.params.userId;

        await FlightBooking.destroy({
            where: { userId }
        });

        res.json({ message: 'All booking history cleared' });
    } catch (error) {
        console.error('Error clearing history:', error);
        res.status(500).json({ message: 'Error clearing history' });
    }
};

// Send booking confirmation email
async function sendBookingConfirmationEmail(booking) {
    let amenitiesList = [];
    try {
        amenitiesList = typeof booking.amenities === 'string' ? JSON.parse(booking.amenities) : (booking.amenities || []);
    } catch (e) {
        amenitiesList = [];
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: booking.passengerEmail,
        subject: `✈️ Flight Booking Confirmed - ${booking.bookingReference}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                    .container { max-width: 700px; margin: 0 auto; padding: 0; background: #f5f5f5; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
                    .header h1 { margin: 0; font-size: 32px; }
                    .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
                    .content { background: white; padding: 30px; }
                    .booking-ref { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; text-align: center; }
                    .booking-ref strong { font-size: 24px; color: #856404; }
                    .flight-card { background: #f8f9fa; border-radius: 12px; padding: 25px; margin: 20px 0; border: 2px solid #e9ecef; }
                    .route-section { display: flex; justify-content: space-between; align-items: center; margin: 20px 0; padding: 20px; background: white; border-radius: 10px; }
                    .city { text-align: center; flex: 1; }
                    .city-code { font-size: 32px; font-weight: bold; color: #667eea; }
                    .city-time { font-size: 18px; color: #333; margin: 10px 0; }
                    .city-date { font-size: 14px; color: #666; }
                    .arrow { flex: 0.5; text-align: center; font-size: 24px; color: #667eea; }
                    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
                    .detail-item { background: #f8f9fa; padding: 15px; border-radius: 8px; }
                    .detail-label { font-size: 12px; color: #666; text-transform: uppercase; }
                    .detail-value { font-size: 16px; font-weight: bold; color: #333; margin-top: 5px; }
                    .price-box { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 12px; text-align: center; margin: 20px 0; }
                    .price-label { font-size: 14px; opacity: 0.9; }
                    .price-value { font-size: 42px; font-weight: bold; margin: 10px 0; }
                    .amenities { margin: 20px 0; }
                    .amenity-tag { display: inline-block; background: #e7f3ff; color: #0066cc; padding: 8px 15px; border-radius: 20px; margin: 5px; font-size: 13px; }
                    .info-box { background: #e7f3ff; border-left: 4px solid #0066cc; padding: 15px; margin: 20px 0; }
                    .footer { text-align: center; color: #6c757d; font-size: 12px; padding: 20px; background: #f8f9fa; }
                    .passenger-info { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✈️ Flight Booking Confirmed!</h1>
                        <p>Your journey begins here</p>
                    </div>
                    <div class="content">
                        <p style="font-size: 18px;">Dear <strong>${booking.passengerName}</strong>,</p>
                        <p>Your flight has been successfully confirmed. Below are your complete booking details:</p>
                        
                        <div class="booking-ref">
                            <div style="font-size: 14px; color: #666; margin-bottom: 5px;">BOOKING REFERENCE</div>
                            <strong>${booking.bookingReference}</strong>
                        </div>

                        <div class="flight-card">
                            <h2 style="color: #667eea; margin-top: 0;">${booking.airlineName} ${booking.flightNumber || ''}</h2>
                            
                            <div class="route-section">
                                <div class="city">
                                    <div class="city-code">${booking.from}</div>
                                    <div class="city-time">${booking.departure}</div>
                                    <div class="city-date">${booking.departureDate}</div>
                                </div>
                                <div class="arrow">
                                    ✈️<br/>
                                    <span style="font-size: 14px; color: #666;">${booking.duration || 'N/A'}</span>
                                </div>
                                <div class="city">
                                    <div class="city-code">${booking.to}</div>
                                    <div class="city-time">${booking.arrival}</div>
                                    <div class="city-date">${booking.arrivalDate || booking.departureDate}</div>
                                </div>
                            </div>

                            <div class="detail-grid">
                                ${booking.flightNumber ? `
                                <div class="detail-item">
                                    <div class="detail-label">Flight Number</div>
                                    <div class="detail-value">${booking.flightNumber}</div>
                                </div>` : ''}
                                
                                ${booking.aircraft ? `
                                <div class="detail-item">
                                    <div class="detail-label">Aircraft</div>
                                    <div class="detail-value">${booking.aircraft}</div>
                                </div>` : ''}
                                
                                ${booking.cabinClass ? `
                                <div class="detail-item">
                                    <div class="detail-label">Cabin Class</div>
                                    <div class="detail-value">${booking.cabinClass}</div>
                                </div>` : ''}
                                
                                ${booking.baggageAllowance ? `
                                <div class="detail-item">
                                    <div class="detail-label">Baggage Allowance</div>
                                    <div class="detail-value">${booking.baggageAllowance}</div>
                                </div>` : ''}
                                
                                ${booking.numberOfStops !== undefined ? `
                                <div class="detail-item">
                                    <div class="detail-label">Stops</div>
                                    <div class="detail-value">${booking.numberOfStops === 0 ? 'Direct Flight' : booking.numberOfStops + ' Stop(s)'}</div>
                                </div>` : ''}
                                
                                ${booking.terminal ? `
                                <div class="detail-item">
                                    <div class="detail-label">Terminal</div>
                                    <div class="detail-value">Terminal ${booking.terminal}</div>
                                </div>` : ''}
                                
                                ${booking.gate ? `
                                <div class="detail-item">
                                    <div class="detail-label">Gate</div>
                                    <div class="detail-value">Gate ${booking.gate}</div>
                                </div>` : ''}
                                
                                <div class="detail-item">
                                    <div class="detail-label">Passengers</div>
                                    <div class="detail-value">${booking.numberOfPassengers || 1}</div>
                                </div>
                            </div>

                            ${amenitiesList && amenitiesList.length > 0 ? `
                            <div class="amenities">
                                <div style="font-weight: bold; margin-bottom: 10px; color: #667eea;">✨ Amenities & Services</div>
                                ${amenitiesList.map(amenity => `<span class="amenity-tag">${amenity}</span>`).join('')}
                            </div>` : ''}
                        </div>

                        <div class="passenger-info">
                            <h3 style="margin-top: 0; color: #667eea;">👤 Passenger Information</h3>
                            <p><strong>Name:</strong> ${booking.passengerName}</p>
                            <p><strong>Email:</strong> ${booking.passengerEmail}</p>
                            ${booking.passengerPhone ? `<p><strong>Phone:</strong> ${booking.passengerPhone}</p>` : ''}
                        </div>

                        <div class="price-box">
                            <div class="price-label">TOTAL AMOUNT PAID</div>
                            <div class="price-value">${booking.currency} ${booking.price.toLocaleString()}</div>
                            ${booking.numberOfPassengers > 1 ? `<div class="price-label">${booking.currency} ${(booking.price / booking.numberOfPassengers).toLocaleString()} per passenger</div>` : ''}
                        </div>

                        <div class="info-box">
                            <strong>📋 Important Information:</strong>
                            <ul style="margin: 10px 0; padding-left: 20px;">
                                <li>Please arrive at the airport at least 3 hours before departure</li>
                                <li>Carry a valid ID and this booking reference</li>
                                <li>Check-in opens 24 hours before departure</li>
                                ${booking.bookingUrl ? `<li>Manage your booking at: <a href="${booking.bookingUrl}" style="color: #667eea;">${booking.airlineName} Website</a></li>` : ''}
                            </ul>
                        </div>

                        <p style="text-align: center; margin: 30px 0;">
                            <strong>Have a safe and pleasant journey! ✈️</strong>
                        </p>

                        <div class="footer">
                            <p>&copy; 2026 Travel System | Flight Booking Confirmation</p>
                            <p style="margin-top: 10px;">This is an automated email. Please do not reply.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        console.log(`📧 Sending Confirmation Email to: ${booking.passengerEmail}...`);
        const info = await sendBookingMail(mailOptions);
        if (!info.sent) {
            throw new Error(info.reason || 'Email not sent');
        }
        console.log('✅ Confirmation Email Sent Successfully!');
        if (info.messageId) console.log('Message ID:', info.messageId);
        return true;
    } catch (error) {
        console.error('❌ Failed to send confirmation email');
        console.error('Error Details:', {
            message: error.message,
            code: error.code,
            command: error.command,
            response: error.response
        });
        // Don't throw error - let booking succeed even if email fails
        return false;
    }
}

// Send cancellation email
async function sendCancellationEmail(booking) {
    let amenitiesList = [];
    try {
        amenitiesList = typeof booking.amenities === 'string' ? JSON.parse(booking.amenities) : (booking.amenities || []);
    } catch (e) {
        amenitiesList = [];
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: booking.passengerEmail,
        subject: `❌ Flight Booking Cancelled - ${booking.bookingReference}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
                    .container { max-width: 700px; margin: 0 auto; padding: 0; background: #f5f5f5; }
                    .header { background: linear-gradient(135deg, #ff6b6b 0%, #c92a2a 100%); color: white; padding: 40px 30px; text-align: center; }
                    .header h1 { margin: 0; font-size: 32px; }
                    .header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
                    .content { background: white; padding: 30px; }
                    .booking-ref { background: #ffe3e3; border-left: 4px solid #ff6b6b; padding: 15px; margin: 20px 0; text-align: center; }
                    .booking-ref strong { font-size: 24px; color: #c92a2a; }
                    .flight-card { background: #f8f9fa; border-radius: 12px; padding: 25px; margin: 20px 0; border: 2px solid #e9ecef; }
                    .route-section { display: flex; justify-content: space-between; align-items: center; margin: 20px 0; padding: 20px; background: white; border-radius: 10px; }
                    .city { text-align: center; flex: 1; }
                    .city-code { font-size: 32px; font-weight: bold; color: #c92a2a; }
                    .city-time { font-size: 18px; color: #333; margin: 10px 0; }
                    .city-date { font-size: 14px; color: #666; }
                    .arrow { flex: 0.5; text-align: center; font-size: 24px; color: #c92a2a; }
                    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
                    .detail-item { background: #f8f9fa; padding: 15px; border-radius: 8px; }
                    .detail-label { font-size: 12px; color: #666; text-transform: uppercase; }
                    .detail-value { font-size: 16px; font-weight: bold; color: #333; margin-top: 5px; }
                    .info-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
                    .refund-box { background: #ffe3e3; border-left: 4px solid #ff6b6b; padding: 20px; margin: 20px 0; border-radius: 8px; }
                    .passenger-info { background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0; }
                    .footer { text-align: center; color: #6c757d; font-size: 12px; padding: 20px; background: #f8f9fa; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>❌ Booking Cancelled</h1>
                        <p>Your flight booking has been cancelled</p>
                    </div>
                    <div class="content">
                        <p style="font-size: 18px;">Dear <strong>${booking.passengerName}</strong>,</p>
                        <p>Your flight booking has been successfully cancelled. Below are the complete details of your cancelled booking:</p>
                        
                        <div class="booking-ref">
                            <div style="font-size: 14px; color: #666; margin-bottom: 5px;">BOOKING REFERENCE</div>
                            <strong>${booking.bookingReference}</strong>
                        </div>

                        <div class="flight-card">
                            <h2 style="color: #c92a2a; margin-top: 0;">🚫 Cancelled Flight: ${booking.airlineName} ${booking.flightNumber || ''}</h2>
                            
                            <div class="route-section">
                                <div class="city">
                                    <div class="city-code">${booking.from}</div>
                                    <div class="city-time">${booking.departure}</div>
                                    <div class="city-date">${booking.departureDate}</div>
                                </div>
                                <div class="arrow">
                                    ✈️<br/>
                                    <span style="font-size: 14px; color: #666;">${booking.duration || 'N/A'}</span>
                                </div>
                                <div class="city">
                                    <div class="city-code">${booking.to}</div>
                                    <div class="city-time">${booking.arrival}</div>
                                    <div class="city-date">${booking.arrivalDate || booking.departureDate}</div>
                                </div>
                            </div>

                            <div class="detail-grid">
                                ${booking.flightNumber ? `
                                <div class="detail-item">
                                    <div class="detail-label">Flight Number</div>
                                    <div class="detail-value">${booking.flightNumber}</div>
                                </div>` : ''}
                                
                                ${booking.aircraft ? `
                                <div class="detail-item">
                                    <div class="detail-label">Aircraft</div>
                                    <div class="detail-value">${booking.aircraft}</div>
                                </div>` : ''}
                                
                                ${booking.cabinClass ? `
                                <div class="detail-item">
                                    <div class="detail-label">Cabin Class</div>
                                    <div class="detail-value">${booking.cabinClass}</div>
                                </div>` : ''}
                                
                                ${booking.baggageAllowance ? `
                                <div class="detail-item">
                                    <div class="detail-label">Baggage Allowance</div>
                                    <div class="detail-value">${booking.baggageAllowance}</div>
                                </div>` : ''}
                                
                                <div class="detail-item">
                                    <div class="detail-label">Passengers</div>
                                    <div class="detail-value">${booking.numberOfPassengers || 1}</div>
                                </div>

                                <div class="detail-item">
                                    <div class="detail-label">Booking Amount</div>
                                    <div class="detail-value">${booking.currency} ${booking.price.toLocaleString()}</div>
                                </div>
                            </div>

                            <div class="detail-grid">
                                <div class="detail-item" style="grid-column: 1 / -1;">
                                    <div class="detail-label">Cancellation Date & Time</div>
                                    <div class="detail-value">${new Date(booking.cancelledAt).toLocaleString()}</div>
                                </div>
                                
                                ${booking.cancellationReason ? `
                                <div class="detail-item" style="grid-column: 1 / -1;">
                                    <div class="detail-label">Cancellation Reason</div>
                                    <div class="detail-value">${booking.cancellationReason}</div>
                                </div>` : ''}
                            </div>
                        </div>

                        <div class="passenger-info">
                            <h3 style="margin-top: 0; color: #c92a2a;">👤 Passenger Information</h3>
                            <p><strong>Name:</strong> ${booking.passengerName}</p>
                            <p><strong>Email:</strong> ${booking.passengerEmail}</p>
                            ${booking.passengerPhone ? `<p><strong>Phone:</strong> ${booking.passengerPhone}</p>` : ''}
                        </div>

                        <div class="refund-box">
                            <h3 style="margin-top: 0; color: #c92a2a;">💰 Refund Information</h3>
                            <p><strong>Original Booking Amount:</strong> ${booking.currency} ${booking.price.toLocaleString()}</p>
                            ${booking.numberOfPassengers > 1 ? `<p><strong>Per Passenger:</strong> ${booking.currency} ${(booking.price / booking.numberOfPassengers).toLocaleString()}</p>` : ''}
                            <p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ffcccc;">
                                <strong>⚠️ Important:</strong> Refund processing depends on the airline's cancellation policy. 
                                Please contact ${booking.airlineName} directly for refund status and processing time.
                            </p>
                        </div>

                        <div class="info-box">
                            <strong>📞 Next Steps for Refund:</strong>
                            <ul style="margin: 10px 0; padding-left: 20px;">
                                <li>Contact <strong>${booking.airlineName}</strong> customer service</li>
                                <li>Provide your booking reference: <strong>${booking.bookingReference}</strong></li>
                                <li>Inquire about their cancellation and refund policy</li>
                                ${booking.bookingUrl ? `<li>Visit: <a href="${booking.bookingUrl}" style="color: #c92a2a;">${booking.airlineName} Website</a></li>` : ''}
                                <li>Refund processing may take 7-14 business days depending on airline policy</li>
                            </ul>
                        </div>

                        <p style="text-align: center; margin: 30px 0; color: #666;">
                            We're sorry to see your plans change. We hope to serve you again in the future.
                        </p>

                        <div class="footer">
                            <p>&copy; 2026 Travel System | Flight Cancellation Confirmation</p>
                            <p style="margin-top: 10px;">This is an automated email. Please do not reply.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        console.log(`📧 Sending Cancellation Email to: ${booking.passengerEmail}...`);
        const info = await sendBookingMail(mailOptions);
        if (!info.sent) {
            throw new Error(info.reason || 'Email not sent');
        }
        console.log('✅ Cancellation Email Sent Successfully!');
        if (info.messageId) console.log('Message ID:', info.messageId);
        return true;
    } catch (error) {
        console.error('❌ Failed to send cancellation email');
        console.error('Error Details:', {
            message: error.message,
            code: error.code,
            command: error.command,
            response: error.response
        });
        // Don't throw error - let cancellation succeed even if email fails
        return false;
    }
}

module.exports = exports;
