import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("🧹 Limpiando historial y ventas de la base de datos...\n");

  // 1. Comments first (FK → Task)
  const comments = await db.taskComment.deleteMany({});
  console.log(`  🗑  TaskComment: ${comments.count}`);

  // 2. Tasks (FK → Order)
  const tasks = await db.task.deleteMany({});
  console.log(`  🗑  Task: ${tasks.count}`);

  // 3. Invoices (FK → Order)
  const invoices = await db.invoice.deleteMany({});
  console.log(`  🗑  Invoice: ${invoices.count}`);

  // 4. Payments (FK → Order)
  const payments = await db.payment.deleteMany({});
  console.log(`  🗑  Payment: ${payments.count}`);

  // 5. Order status history (FK → Order)
  const histories = await db.orderStatusHistory.deleteMany({});
  console.log(`  🗑  OrderStatusHistory: ${histories.count}`);

  // 6. Order items (FK → Order, Product)
  const items = await db.orderItem.deleteMany({});
  console.log(`  🗑  OrderItem: ${items.count}`);

  // 7. Orders
  const orders = await db.order.deleteMany({});
  console.log(`  🗑  Order: ${orders.count}`);

  // 8. Service requests
  const reqs = await db.serviceRequest.deleteMany({});
  console.log(`  🗑  ServiceRequest: ${reqs.count}`);

  // 9. Notifications
  const notifs = await db.notification.deleteMany({});
  console.log(`  🗑  Notification: ${notifs.count}`);

  // 10. Reviews
  const reviews = await db.review.deleteMany({});
  console.log(`  🗑  Review: ${reviews.count}`);

  // 11. Audit logs
  const logs = await db.auditLog.deleteMany({});
  console.log(`  🗑  AuditLog: ${logs.count}`);

  // 12. Push subscriptions
  const pushSubs = await db.pushSubscription.deleteMany({});
  console.log(`  🗑  PushSubscription: ${pushSubs.count}`);

  // 13. Reset client counters
  const clientReset = await db.cliente.updateMany({
    data: { totalOrders: 0, totalSpent: 0 },
  });
  console.log(`  🔄  Cliente counters reset: ${clientReset.count}`);

  console.log("\n✅ Base de datos limpiada. Usuarios y productos intactos.");
}

main()
  .catch((e) => { console.error("❌ Error:", e); process.exit(1); })
  .finally(() => db.$disconnect());
