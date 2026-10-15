CREATE TABLE IF NOT EXISTS "BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "coverGradient" TEXT NOT NULL DEFAULT 'linear-gradient(135deg, #0d3c4d 0%, #1d7291 55%, #008f65 100%)',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT NOT NULL,
    "readTime" INTEGER NOT NULL DEFAULT 5,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "showComparisonTable" BOOLEAN NOT NULL DEFAULT false,
    "tipText" TEXT,
    "authorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "BlogPost_slug_key" ON "BlogPost"("slug");
CREATE INDEX IF NOT EXISTS "BlogPost_isPublished_date_idx" ON "BlogPost"("isPublished", "date");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'BlogPost_authorId_fkey'
  ) THEN
    ALTER TABLE "BlogPost"
      ADD CONSTRAINT "BlogPost_authorId_fkey"
      FOREIGN KEY ("authorId") REFERENCES "User"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "showComparisonTable" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "comparisonTable" TEXT;
ALTER TABLE "BlogPost" ADD COLUMN IF NOT EXISTS "tipText" TEXT;
