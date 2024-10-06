// import { join } from 'path';
// import { verifyPayment } from './payment.utils';
// import { readFileSync } from 'fs';

// const confirmationService = async (transactionID: string) => {
//   const verifyResponse = await verifyPayment(transactionID); // Verify payment

//   let message = '';
//   let bookingData: IBooking | null = null;
//   let roomData: IRoom | null = null;
//   let slotData: ISlot[] = [];

//   // Find booking using transactionID
//   bookingData = await Booking.findOne({ transactionID })
//     .populate('slots')
//     .populate('room');

//   const roomId = bookingData?.room as unknown as string; // Extract room ID from booking data
//   const slotIds = bookingData?.slots.map((slot) => slot._id); // Extract slot IDs from booking data
//   roomData = await Room.findById(roomId);

//   slotData = await Slot.find({ _id: { $in: slotIds } });

//   // Check if slotData is an array
//   if (!Array.isArray(slotData)) {
//     return `<h1 class='failed-payment'>Error retrieving slot details!</h1>`;
//   }

//   if (verifyResponse && verifyResponse.pay_status === 'Successful') {
//     bookingData = await Booking.findOneAndUpdate(
//       { transactionID },
//       { paymentStatus: 'Paid', isConfirmed: 'confirmed' },
//       { new: true }, // Return updated booking data
//     );

//     const roomName = roomData?.name;
//     const roomNumber = roomData?.roomNo;
//     const totalAmount = bookingData?.totalAmount;

//     message = ` <h1 class='success-payment'>Thank You! </h1>
//                 <h2>Your booking Is Confirmed and Payment Successful</h2>
//                 <p>You will receive a confirmation email with your booking details shortly.</p>
//                 <h2>Booking Details:</h2>
//                 <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
//                 <tr>
//                     <th style="border: 1px solid #ddd; padding: 8px;">Room Details</th>
//                         <td style="border: 1px solid #ddd; padding: 8px;">
//                             <div style="display: flex; justify-content: center; align-items: center; gap: 10px; padding: 8px;">
//                                 <div><strong>Room Name:</strong> ${roomName}</div>
//                                 <div><strong>Room No:</strong> ${roomNumber}</div>
//                             </div>

//                         </td>
//                 </tr>
//                 <tr>
//                     <th style="border: 1px solid #ddd; padding: 8px;">Slot Details</th>
//                         <td style="border: 1px solid #ddd; padding: 8px;">
//                             ${slotData
//                               .map(
//                                 (
//                                   slot,
//                                 ) => `<div><li><strong>Date</strong>: ${slot.date},
//                             <strong>Start Time:</strong> ${slot?.startTime},
//                             <strong>End Time:</strong> ${slot?.endTime}</li></div>`,
//                               )
//                               .join('')}
//                         </td>
//                 </tr>
//                 <tr>
//                     <th style="border: 1px solid #ddd; padding: 8px;">Total Amount</th>
//                         <td style="border: 1px solid #ddd; padding: 8px; text-align: center">$${totalAmount}</td>
//                 </tr>
//                 <tr>
//                     <th style="border: 1px solid #ddd; padding: 8px;">Transaction ID</th>
//                         <td style="border: 1px solid #ddd; padding: 8px; text-align: center">${bookingData?.transactionID}</td>
//                 </tr>
//                 </table>
//                 <a href="https://nexus-reserve.vercel.app/" class="button">Go to Home</a>
//                 <p style='text-align: center'><strong>Thank you for choosing Nexus Reserve!</strong></p>`;
//   } else {
//     message = `<h1 class='failed-payment'>Payment Failed!</h1>
//                 <h3>Oops! Something went wrong with your payment.
//                 <span class="bold">Please verify your payment information and try again</span>!</h3>
//                 <p>If you need assistance, our support team is here to help.</p>
//                 <a href="https://nexus-reserve.vercel.app/" class="button">Go to Home</a>`;
//   }

//   // Read and update the HTML template
//   const filePath = join(__dirname, '../../../../public/confirmation.html');

//   //   const filePath = join(__dirname, '../../views/confirmation.html');
//   let template = readFileSync(filePath, 'utf8');
//   template = template.replace('{{message}}', message);
//   return template;
// };

// export const PaymentService = {
//   confirmationService,
// };
