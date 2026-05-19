require('dotenv').config();
const nodemailer = require('nodemailer');

// Email transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Mock booking data for testing cancellation email
const mockCancelledBooking = {
    passengerName: 'Test User',
    passengerEmail: 'apploginsmk@gmail.com', // Send to this email
    passengerPhone: '+92 300 1234567',
    bookingReference: 'TEST-CANCEL-123',
    airlineName: 'Emirates',
    flightNumber: 'EK-501',
    from: 'KHI',
    to: 'DXB',
    departure: '14:30',
    arrival: '16:45',
    departureDate: '2026-01-30',
    arrivalDate: '2026-01-30',
    duration: '2h 15m',
    price: 85000,
    currency: 'PKR',
    numberOfPassengers: 1,
    aircraft: 'Boeing 777',
    cabinClass: 'Economy',
    baggageAllowance: '30kg',
    numberOfStops: 0,
    terminal: 3,
    gate: 'A12',
    bookingUrl: 'https://www.emirates.com',
    cancelledAt: new Date(),
    cancellationReason: 'Testing cancellation email functionality',
    amenities: ['In-flight Entertainment', 'WiFi Available', 'Meals Included', 'Direct Flight']
};

async function sendTestCancellationEmail() {
    console.log('📧 Sending TEST Cancellation Email...\n');
    console.log('To:', mockCancelledBooking.passengerEmail);
    console.log('Booking Reference:', mockCancelledBooking.bookingReference);
    console.log('');

    let amenitiesList = [];
    try {
        amenitiesList = typeof mockCancelledBooking.amenities === 'string'
            ? JSON.parse(mockCancelledBooking.amenities)
            : (mockCancelledBooking.amenities || []);
    } catch (e) {
        amenitiesList = [];
    }

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: mockCancelledBooking.passengerEmail,
        subject: `❌ Flight Booking Cancelled - ${mockCancelledBooking.bookingReference}`,
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
                        <p style="font-size: 18px;">Dear <strong>${mockCancelledBooking.passengerName}</strong>,</p>
                        <p>Your flight booking has been successfully cancelled. Below are the complete details of your cancelled booking:</p>
                        
                        <div class="booking-ref">
                            <div style="font-size: 14px; color: #666; margin-bottom: 5px;">BOOKING REFERENCE</div>
                            <strong>${mockCancelledBooking.bookingReference}</strong>
                        </div>

                        <div class="flight-card">
                            <h2 style="color: #c92a2a; margin-top: 0;">🚫 Cancelled Flight: ${mockCancelledBooking.airlineName} ${mockCancelledBooking.flightNumber || ''}</h2>
                            
                            <div class="route-section">
                                <div class="city">
                                    <div class="city-code">${mockCancelledBooking.from}</div>
                                    <div class="city-time">${mockCancelledBooking.departure}</div>
                                    <div class="city-date">${mockCancelledBooking.departureDate}</div>
                                </div>
                                <div class="arrow">
                                    ✈️<br/>
                                    <span style="font-size: 14px; color: #666;">${mockCancelledBooking.duration || 'N/A'}</span>
                                </div>
                                <div class="city">
                                    <div class="city-code">${mockCancelledBooking.to}</div>
                                    <div class="city-time">${mockCancelledBooking.arrival}</div>
                                    <div class="city-date">${mockCancelledBooking.arrivalDate || mockCancelledBooking.departureDate}</div>
                                </div>
                            </div>

                            <div class="detail-grid">
                                ${mockCancelledBooking.flightNumber ? `
                                <div class="detail-item">
                                    <div class="detail-label">Flight Number</div>
                                    <div class="detail-value">${mockCancelledBooking.flightNumber}</div>
                                </div>` : ''}
                                
                                ${mockCancelledBooking.aircraft ? `
                                <div class="detail-item">
                                    <div class="detail-label">Aircraft</div>
                                    <div class="detail-value">${mockCancelledBooking.aircraft}</div>
                                </div>` : ''}
                                
                                ${mockCancelledBooking.cabinClass ? `
                                <div class="detail-item">
                                    <div class="detail-label">Cabin Class</div>
                                    <div class="detail-value">${mockCancelledBooking.cabinClass}</div>
                                </div>` : ''}
                                
                                ${mockCancelledBooking.baggageAllowance ? `
                                <div class="detail-item">
                                    <div class="detail-label">Baggage Allowance</div>
                                    <div class="detail-value">${mockCancelledBooking.baggageAllowance}</div>
                                </div>` : ''}
                                
                                <div class="detail-item">
                                    <div class="detail-label">Passengers</div>
                                    <div class="detail-value">${mockCancelledBooking.numberOfPassengers || 1}</div>
                                </div>

                                <div class="detail-item">
                                    <div class="detail-label">Booking Amount</div>
                                    <div class="detail-value">${mockCancelledBooking.currency} ${mockCancelledBooking.price.toLocaleString()}</div>
                                </div>
                            </div>

                            <div class="detail-grid">
                                <div class="detail-item" style="grid-column: 1 / -1;">
                                    <div class="detail-label">Cancellation Date & Time</div>
                                    <div class="detail-value">${new Date(mockCancelledBooking.cancelledAt).toLocaleString()}</div>
                                </div>
                                
                                ${mockCancelledBooking.cancellationReason ? `
                                <div class="detail-item" style="grid-column: 1 / -1;">
                                    <div class="detail-label">Cancellation Reason</div>
                                    <div class="detail-value">${mockCancelledBooking.cancellationReason}</div>
                                </div>` : ''}
                            </div>
                        </div>

                        <div class="passenger-info">
                            <h3 style="margin-top: 0; color: #c92a2a;">👤 Passenger Information</h3>
                            <p><strong>Name:</strong> ${mockCancelledBooking.passengerName}</p>
                            <p><strong>Email:</strong> ${mockCancelledBooking.passengerEmail}</p>
                            ${mockCancelledBooking.passengerPhone ? `<p><strong>Phone:</strong> ${mockCancelledBooking.passengerPhone}</p>` : ''}
                        </div>

                        <div class="refund-box">
                            <h3 style="margin-top: 0; color: #c92a2a;">💰 Refund Information</h3>
                            <p><strong>Original Booking Amount:</strong> ${mockCancelledBooking.currency} ${mockCancelledBooking.price.toLocaleString()}</p>
                            ${mockCancelledBooking.numberOfPassengers > 1 ? `<p><strong>Per Passenger:</strong> ${mockCancelledBooking.currency} ${(mockCancelledBooking.price / mockCancelledBooking.numberOfPassengers).toLocaleString()}</p>` : ''}
                            <p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #ffcccc;">
                                <strong>⚠️ Important:</strong> Refund processing depends on the airline's cancellation policy. 
                                Please contact ${mockCancelledBooking.airlineName} directly for refund status and processing time.
                            </p>
                        </div>

                        <div class="info-box">
                            <strong>📞 Next Steps for Refund:</strong>
                            <ul style="margin: 10px 0; padding-left: 20px;">
                                <li>Contact <strong>${mockCancelledBooking.airlineName}</strong> customer service</li>
                                <li>Provide your booking reference: <strong>${mockCancelledBooking.bookingReference}</strong></li>
                                <li>Inquire about their cancellation and refund policy</li>
                                ${mockCancelledBooking.bookingUrl ? `<li>Visit: <a href="${mockCancelledBooking.bookingUrl}" style="color: #c92a2a;">${mockCancelledBooking.airlineName} Website</a></li>` : ''}
                                <li>Refund processing may take 7-14 business days depending on airline policy</li>
                            </ul>
                        </div>

                        <p style="text-align: center; margin: 30px 0; color: #666;">
                            We're sorry to see your plans change. We hope to serve you again in the future.
                        </p>

                        <div class="footer">
                            <p>&copy; 2026 Travel System | Flight Cancellation Confirmation</p>
                            <p style="margin-top: 10px;">This is an automated email. Please do not reply.</p>
                            <p style="margin-top: 10px; font-size: 10px; color: #999;">This is a TEST email sent for verification purposes.</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    try {
        console.log('📧 Sending Cancellation Email to: apploginsmk@gmail.com...');
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Cancellation Email Sent Successfully!');
        console.log('Message ID:', info.messageId);
        console.log('\n🎉 Check the inbox (and spam folder) of apploginsmk@gmail.com');
        console.log('Subject: ❌ Flight Booking Cancelled - TEST-CANCEL-123');
    } catch (error) {
        console.error('\n❌ Failed to send cancellation email');
        console.error('Error Details:', {
            message: error.message,
            code: error.code,
            command: error.command,
            response: error.response
        });
    }
}

sendTestCancellationEmail();
