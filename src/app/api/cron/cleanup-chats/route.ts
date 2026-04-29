import { db } from "@/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const sevenDaysAgo  = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const threeDaysAgo  = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

  const [completedTasks, cancelledTasks] = await Promise.all([
    db.task.findMany({
      where: {
        order: { status: "completada", paymentStatus: "pagado", completedDate: { lte: sevenDaysAgo } },
      },
      select: { id: true },
    }),
    db.task.findMany({
      where: {
        order: { status: "cancelada", cancelledDate: { lte: threeDaysAgo } },
      },
      select: { id: true },
    }),
  ]);

  const taskIds = [...completedTasks, ...cancelledTasks].map(t => t.id);
  if (taskIds.length === 0) return NextResponse.json({ deleted: 0 });

  const { count } = await db.taskComment.deleteMany({ where: { taskId: { in: taskIds } } });
  return NextResponse.json({ deleted: count });
}
