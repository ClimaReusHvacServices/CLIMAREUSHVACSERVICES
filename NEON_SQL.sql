-- ============================================
-- CLIMA REUS HVAC - SQL PARA NEON
-- ============================================
-- COPIA TODO ESTO Y PÉGALO EN NEON SQL EDITOR
-- NO CAMBIES NADA
-- ============================================

-- 1. LIMPIAR SI ES NECESARIO (ejecuta esto solo si ves errores)
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;

-- 2. Crear ENUMs
CREATE TYPE "UserRole" AS ENUM ('admin', 'cliente', 'trabajador');
CREATE TYPE "OrderStatus" AS ENUM ('pendiente', 'confirmada', 'en_progreso', 'completada', 'cancelada');
CREATE TYPE "PaymentStatus" AS ENUM ('pendiente', 'pagado', 'fallido', 'reembolsado');
CREATE TYPE "TaskStatus" AS ENUM ('pendiente', 'en_progreso', 'completada', 'cancelada');

-- 3. Tabla User
CREATE TABLE IF NOT EXISTS "User" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  "firstName" VARCHAR(100) NOT NULL,
  "lastName" VARCHAR(100) NOT NULL,
  "phoneNumber" VARCHAR(20),
  address VARCHAR(255),
  city VARCHAR(100),
  "postalCode" VARCHAR(20),
  country VARCHAR(100),
  role "UserRole" DEFAULT 'cliente',
  "profileImageUrl" VARCHAR(500),
  "isActive" BOOLEAN DEFAULT true,
  "emailVerified" BOOLEAN DEFAULT false,
  "emailVerifiedAt" TIMESTAMP,
  "rememberTokenHash" VARCHAR(255),
  "lastLoginAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_user_username ON "User"(username);
CREATE INDEX idx_user_role ON "User"(role);

-- 4. Tabla Account
CREATE TABLE IF NOT EXISTS "Account" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type VARCHAR(50),
  scope TEXT,
  id_token TEXT,
  session_state VARCHAR(255),
  UNIQUE(provider, "providerAccountId")
);
CREATE INDEX idx_account_userid ON "Account"("userId");

-- 5. Tabla Session
CREATE TABLE IF NOT EXISTS "Session" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "sessionToken" VARCHAR(255) UNIQUE NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  expires TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_session_userid ON "Session"("userId");

-- 6. Tabla VerificationToken
CREATE TABLE IF NOT EXISTS "VerificationToken" (
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires TIMESTAMP NOT NULL,
  type VARCHAR(50) DEFAULT 'email_verification',
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (identifier, token)
);
CREATE INDEX idx_verificationtoken_expires ON "VerificationToken"(expires);

-- 7. Tabla Cliente
CREATE TABLE IF NOT EXISTS "Cliente" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT UNIQUE NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  "companyName" VARCHAR(255),
  "businessRegNumber" VARCHAR(50),
  "totalOrders" INTEGER DEFAULT 0,
  "totalSpent" NUMERIC(10,2) DEFAULT 0,
  "averageRating" NUMERIC(3,2),
  "preferredLanguage" VARCHAR(5) DEFAULT 'es',
  "isBlacklisted" BOOLEAN DEFAULT false,
  "blacklistedReason" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_cliente_userid ON "Cliente"("userId");

-- 8. Tabla ClientAddress
CREATE TABLE IF NOT EXISTS "ClientAddress" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "clienteId" TEXT NOT NULL REFERENCES "Cliente"(id) ON DELETE CASCADE,
  label VARCHAR(50) DEFAULT 'principal',
  street VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  "postalCode" VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  "isDefault" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_clientaddress_clienteid ON "ClientAddress"("clienteId");

-- 9. Tabla Trabajador
CREATE TABLE IF NOT EXISTS "Trabajador" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT UNIQUE NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  specialties TEXT[] DEFAULT '{}',
  certifications TEXT[] DEFAULT '{}',
  "yearsExperience" INTEGER DEFAULT 0,
  "isAvailable" BOOLEAN DEFAULT true,
  availability TEXT,
  "hourlyRate" NUMERIC(8,2),
  "averageRating" NUMERIC(3,2),
  "totalJobsCompleted" INTEGER DEFAULT 0,
  "verificationStatus" VARCHAR(50) DEFAULT 'pending',
  "verificationDate" TIMESTAMP,
  documents TEXT[] DEFAULT '{}',
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_trabajador_userid ON "Trabajador"("userId");
CREATE INDEX idx_trabajador_available ON "Trabajador"("isAvailable");
CREATE INDEX idx_trabajador_verification ON "Trabajador"("verificationStatus");

-- 10. Tabla Product
CREATE TABLE IF NOT EXISTS "Product" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  "shortDescription" VARCHAR(500),
  category VARCHAR(100) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  manufacturer VARCHAR(100),
  "modelNumber" VARCHAR(100),
  price NUMERIC(10,2) NOT NULL,
  "discountPrice" NUMERIC(10,2),
  stock INTEGER DEFAULT 0,
  "minStock" INTEGER DEFAULT 5,
  "maxStock" INTEGER DEFAULT 100,
  images TEXT[] DEFAULT '{}',
  specifications TEXT,
  warranty VARCHAR(100),
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_product_category ON "Product"(category);
CREATE INDEX idx_product_sku ON "Product"(sku);
CREATE INDEX idx_product_active ON "Product"("isActive");

-- 11. Tabla Service
CREATE TABLE IF NOT EXISTS "Service" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  type VARCHAR(100) NOT NULL,
  "basePrice" NUMERIC(10,2) NOT NULL,
  "estimatedDuration" INTEGER NOT NULL,
  difficulty VARCHAR(50) DEFAULT 'media',
  requirements TEXT[] DEFAULT '{}',
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_service_type ON "Service"(type);
CREATE INDEX idx_service_active ON "Service"("isActive");

-- 12. Tabla ServicePackage
CREATE TABLE IF NOT EXISTS "ServicePackage" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  "productId" TEXT NOT NULL REFERENCES "Product"(id) ON DELETE CASCADE,
  "serviceId" TEXT NOT NULL REFERENCES "Service"(id) ON DELETE CASCADE,
  "packagePrice" NUMERIC(10,2) NOT NULL,
  "discountPercentage" NUMERIC(5,2),
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("productId", "serviceId")
);
CREATE INDEX idx_servicepackage_productid ON "ServicePackage"("productId");
CREATE INDEX idx_servicepackage_serviceid ON "ServicePackage"("serviceId");

-- 13. Tabla Order
CREATE TABLE IF NOT EXISTS "Order" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderNumber" VARCHAR(50) UNIQUE NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE RESTRICT,
  "clientId" TEXT NOT NULL REFERENCES "Cliente"(id) ON DELETE RESTRICT,
  "addressId" TEXT NOT NULL REFERENCES "ClientAddress"(id) ON DELETE RESTRICT,
  status "OrderStatus" DEFAULT 'pendiente',
  "paymentStatus" "PaymentStatus" DEFAULT 'pendiente',
  subtotal NUMERIC(10,2) NOT NULL,
  "taxAmount" NUMERIC(10,2) NOT NULL,
  "shippingCost" NUMERIC(10,2) NOT NULL,
  "totalAmount" NUMERIC(10,2) NOT NULL,
  "installationRequired" BOOLEAN DEFAULT false,
  notes TEXT,
  "scheduledDate" TIMESTAMP,
  "completedDate" TIMESTAMP,
  "cancelledDate" TIMESTAMP,
  "cancelledReason" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_order_userid ON "Order"("userId");
CREATE INDEX idx_order_clientid ON "Order"("clientId");
CREATE INDEX idx_order_status ON "Order"(status);
CREATE INDEX idx_order_paymentstatus ON "Order"("paymentStatus");
CREATE INDEX idx_order_created ON "Order"("createdAt");

-- 14. Tabla OrderItem
CREATE TABLE IF NOT EXISTS "OrderItem" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderId" TEXT NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
  "productId" TEXT REFERENCES "Product"(id) ON DELETE SET NULL,
  "servicePackageId" TEXT REFERENCES "ServicePackage"(id) ON DELETE SET NULL,
  quantity INTEGER DEFAULT 1,
  "unitPrice" NUMERIC(10,2) NOT NULL,
  discount NUMERIC(10,2) DEFAULT 0,
  "totalPrice" NUMERIC(10,2) NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_orderitem_orderid ON "OrderItem"("orderId");
CREATE INDEX idx_orderitem_productid ON "OrderItem"("productId");

-- 15. Tabla OrderStatusHistory
CREATE TABLE IF NOT EXISTS "OrderStatusHistory" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderId" TEXT NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
  "previousStatus" "OrderStatus" NOT NULL,
  "newStatus" "OrderStatus" NOT NULL,
  notes TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_orderstatushistory_orderid ON "OrderStatusHistory"("orderId");
CREATE INDEX idx_orderstatushistory_created ON "OrderStatusHistory"("createdAt");

-- 16. Tabla Payment
CREATE TABLE IF NOT EXISTS "Payment" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderId" TEXT UNIQUE NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'EUR',
  "paymentMethod" VARCHAR(100) NOT NULL,
  "transactionId" VARCHAR(255) UNIQUE,
  status "PaymentStatus" DEFAULT 'pendiente',
  "failureReason" TEXT,
  "paidAt" TIMESTAMP,
  "refundedAt" TIMESTAMP,
  "refundAmount" NUMERIC(10,2),
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_payment_orderid ON "Payment"("orderId");
CREATE INDEX idx_payment_status ON "Payment"(status);

-- 17. Tabla Invoice
CREATE TABLE IF NOT EXISTS "Invoice" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderId" TEXT NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
  "invoiceNumber" VARCHAR(50) UNIQUE NOT NULL,
  "issueDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "dueDate" TIMESTAMP NOT NULL,
  "paidDate" TIMESTAMP,
  "totalAmount" NUMERIC(10,2) NOT NULL,
  "taxAmount" NUMERIC(10,2) NOT NULL,
  notes TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_invoice_orderid ON "Invoice"("orderId");
CREATE INDEX idx_invoice_number ON "Invoice"("invoiceNumber");

-- 18. Tabla Task
CREATE TABLE IF NOT EXISTS "Task" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderId" TEXT UNIQUE NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
  "assignedToId" TEXT REFERENCES "User"(id) ON DELETE SET NULL,
  status "TaskStatus" DEFAULT 'pendiente',
  priority VARCHAR(50) DEFAULT 'media',
  description TEXT NOT NULL,
  "startDate" TIMESTAMP,
  "endDate" TIMESTAMP,
  "completedAt" TIMESTAMP,
  notes TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_task_orderid ON "Task"("orderId");
CREATE INDEX idx_task_assignedto ON "Task"("assignedToId");
CREATE INDEX idx_task_status ON "Task"(status);

-- 19. Tabla TaskComment
CREATE TABLE IF NOT EXISTS "TaskComment" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "taskId" TEXT NOT NULL REFERENCES "Task"(id) ON DELETE CASCADE,
  "authorId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_taskcomment_taskid ON "TaskComment"("taskId");
CREATE INDEX idx_taskcomment_authorid ON "TaskComment"("authorId");

-- 20. Tabla Review
CREATE TABLE IF NOT EXISTS "Review" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderId" TEXT REFERENCES "Order"(id),
  "clienteId" TEXT NOT NULL REFERENCES "Cliente"(id) ON DELETE CASCADE,
  "trabajadorId" TEXT REFERENCES "Trabajador"(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  comment TEXT NOT NULL,
  helpful INTEGER DEFAULT 0,
  unhelpful INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_review_clienteid ON "Review"("clienteId");
CREATE INDEX idx_review_trabajadorid ON "Review"("trabajadorId");
CREATE INDEX idx_review_rating ON "Review"(rating);

-- 21. Tabla Notification
CREATE TABLE IF NOT EXISTS "Notification" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  "relatedId" TEXT,
  "isRead" BOOLEAN DEFAULT false,
  "readAt" TIMESTAMP,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_notification_userid ON "Notification"("userId");
CREATE INDEX idx_notification_read ON "Notification"("isRead");
CREATE INDEX idx_notification_created ON "Notification"("createdAt");

-- 22. Tabla AuditLog
CREATE TABLE IF NOT EXISTS "AuditLog" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "userId" TEXT REFERENCES "User"(id),
  action VARCHAR(100) NOT NULL,
  "entityType" VARCHAR(100) NOT NULL,
  "entityId" TEXT NOT NULL,
  changes TEXT,
  "ipAddress" VARCHAR(45),
  "userAgent" TEXT,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_auditlog_userid ON "AuditLog"("userId");
CREATE INDEX idx_auditlog_entitytype ON "AuditLog"("entityType");
CREATE INDEX idx_auditlog_created ON "AuditLog"("createdAt");

-- ============================================
-- CONFIRMACIÓN
-- ============================================
SELECT 'Base de datos creada correctamente ✅' AS status;
