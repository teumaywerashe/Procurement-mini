// import * as dotenv from 'dotenv';
// dotenv.config({ path: '../.env' });
// dotenv.config();

// import { db } from './db';
// import { users } from './schema/user.schema';
// import { vendor } from './schema/vendor.schema';
// import { tender } from './schema/tender.schema';
// import { bid } from './schema/bid.schema';
// import { UserRole } from '../user/enum/userRole.enum';
// import { tenderStatus } from '../tender/enum/tenderStatus.enum';
// import * as bcrypt from 'bcryptjs';

// export async function seed() {
//   console.log('🌱 Starting Database Seeding...');

//   const categories = [
//     'Infrastructure',
//     'Logistics',
//     'Technology',
//     'Healthcare',
//     'Education',
//     'Environment',
//   ];

//   // 1. Clean existing records in reverse dependency order
//   console.log('🧹 Cleaning existing data...');
//   console.log('  Deleting bids...');
//   await db.delete(bid);
//   console.log('  Deleting vendors...');
//   await db.delete(vendor);
//   console.log('  Deleting tenders...');
//   await db.delete(tender);
//   console.log('  Deleting users...');
//   await db.delete(users);

//   const hashedPassword = await bcrypt?.hash('password123', 10);

//   // 2. Create 1 SuperAdmin
//   console.log('👤 Creating SuperAdmin user...');
//   const [superAdminUser] = await db
//     .insert(users)
//     .values({
//       name: 'Global SuperAdmin',
//       email: 'superadmin@procurehub.com',
//       role: UserRole.SUPER_ADMIN,
//       password: hashedPassword,
//     })
//     .returning();

//   // 3. Create 2 Admin users
//   console.log('👥 Creating 2 Admin users...');
//   const [admin1User] = await db
//     .insert(users)
//     .values({
//       name: 'Alpha IT Procurement Admin',
//       email: 'admin1@procurehub.com',
//       role: UserRole.ADMIN,
//       password: hashedPassword,
//     })
//     .returning();

//   const [admin2User] = await db
//     .insert(users)
//     .values({
//       name: 'Beta Operations Admin',
//       email: 'admin2@procurehub.com',
//       role: UserRole.ADMIN,
//       password: hashedPassword,
//     })
//     .returning();

//   // 4. Create 20 Tenders for Admin 1
//   console.log('📦 Creating 20 Tenders for Admin 1...');
//   const admin1TendersData = [
//     {
//       title: 'Cloud Infrastructure Migration & Optimization',
//       value: 120000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'Enterprise Cyber Security Audit & Firewall Upgrade',
//       value: 85000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'AI-Powered Customer Support Chatbot Platform',
//       value: 45000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'High-Performance Data Center Server Replacement',
//       value: 210000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'Corporate Fiber Network Expansion & 5G Integration',
//       value: 150000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'SaaS Enterprise Resource Planning (ERP) Implementation',
//       value: 300000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'DevOps Automated CI/CD Pipeline Modernization',
//       value: 65000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'Mobile Banking & Payment Application Redesign',
//       value: 95000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'Biometric Access Control & Surveillance System',
//       value: 75000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'Cloud Backup & Disaster Recovery Architecture',
//       value: 50000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'Database Optimization & Distributed Caching Setup',
//       value: 40000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'Enterprise Web Portal & Content Management System',
//       value: 55000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'Microservices Architecture API Gateway Deployment',
//       value: 70000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'VoIP Telephony & Unified Communications Migration',
//       value: 35000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'Data Warehouse Analytics & Business Intelligence Dashboard',
//       value: 110000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'Smart Office IoT Sensors & Energy Management',
//       value: 60000,
//       status: tenderStatus.DRAFT,
//     },
//     {
//       title: 'IT Service Desk Ticketing System Upgrade',
//       value: 30000,
//       status: tenderStatus.CLOSED,
//     },
//     {
//       title: 'Legacy COBOL Application Cloud Refactoring',
//       value: 180000,
//       status: tenderStatus.AWARDED,
//     },
//     {
//       title: 'Employee Digital Identity & IAM SSO Platform',
//       value: 90000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'Zero Trust Network Architecture Integration',
//       value: 130000,
//       status: tenderStatus.PUBLISHED,
//     },
//   ];

//   const admin1Tenders = [];
//   for (let i = 0; i < admin1TendersData.length; i++) {
//     const item = admin1TendersData[i];
//     const [t] = await db
//       .insert(tender)
//       .values({
//         name: categories[i % categories.length],
//         title: item.title,
//         description: `Official procurement tender for ${item.title.toLowerCase()}. Requirements include full technical documentation, SLA guarantees, and multi-year support options.`,
//         status: item.status,
//         closingDate: new Date(Date.now() + (i + 5) * 24 * 60 * 60 * 1000),
//         referenceNumber: `TND-ADM1-${101 + i}`,
//         estimatedValue: item.value,
//         createdBy: admin1User.id,
//       })
//       .returning();
//     admin1Tenders.push(t);
//   }

//   // 5. Create 20 Tenders for Admin 2
//   console.log('📦 Creating 20 Tenders for Admin 2...');
//   const admin2TendersData = [
//     {
//       title: 'Fleet Vehicle Leasing & Maintenance Service',
//       value: 250000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'Solar Panel System Installation & Off-Grid Battery Setup',
//       value: 180000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'HQ Facility General Maintenance & Janitorial Services',
//       value: 75000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'Corporate Event Catering & Hospitality Management',
//       value: 45000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: '24/7 Security Personnel Guard Services',
//       value: 120000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'High-Volume Commercial Printing & Promotional Supplies',
//       value: 35000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'Hazardous Waste Disposal & Eco Recycling Contract',
//       value: 65000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'HVAC Air Purification & Central AC Maintenance',
//       value: 90000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'Ergonomic Office Furniture & Workstation Supply',
//       value: 80000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'Warehouse Supply Chain Logistics & Freight Handling',
//       value: 310000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'Legal Compliance Advisory & Intellectual Property Retainer',
//       value: 140000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'Annual Financial Audit & Risk Assessment Consulting',
//       value: 95000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'Executive Leadership Staff Training & Development',
//       value: 40000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'Sustainable Eco Packaging Materials Supply',
//       value: 50000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'Industrial Fire Safety Equipment & Hydrant Inspection',
//       value: 30000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'Commercial Water Filtration & Dispenser Service',
//       value: 25000,
//       status: tenderStatus.PUBLISHED,
//     },
//     {
//       title: 'Building Exterior Facade Cleaning & Restoration',
//       value: 70000,
//       status: tenderStatus.DRAFT,
//     },
//     {
//       title: 'Shuttle Bus Transport Services for Employees',
//       value: 160000,
//       status: tenderStatus.CLOSED,
//     },
//     {
//       title: 'Cafeteria Kitchen Automation & Equipment Lease',
//       value: 110000,
//       status: tenderStatus.AWARDED,
//     },
//     {
//       title: 'Document Digitization & Archival Scanning Service',
//       value: 60000,
//       status: tenderStatus.PUBLISHED,
//     },
//   ];

//   const admin2Tenders = [];
//   for (let i = 0; i < admin2TendersData.length; i++) {
//     const item = admin2TendersData[i];
//     const [t] = await db
//       .insert(tender)
//       .values({
//         name: categories[i % categories.length],
//         title: item.title,
//         description: `Procurement notice for ${item.title.toLowerCase()}. Bidders must present verifiable certificates of compliance and competitive pricing structures.`,
//         status: item.status,
//         closingDate: new Date(Date.now() + (i + 7) * 24 * 60 * 60 * 1000),
//         referenceNumber: `TND-ADM2-${201 + i}`,
//         estimatedValue: item.value,
//         createdBy: admin2User.id,
//       })
//       .returning();
//     admin2Tenders.push(t);
//   }

//   const allTenders = [...admin1Tenders, ...admin2Tenders];
//   const publishedTenders = allTenders.filter(
//     (t) => t?.status === tenderStatus.PUBLISHED,
//   );

//   // 6. Create 6 Vendor Users & Vendor profiles
//   console.log('🏪 Creating 6 Vendor Users and Vendor profiles...');
//   const vendorConfigs = [
//     {
//       company: 'Apex Tech Solutions',
//       email: 'vendor1@procurehub.com',
//       phone: '+12345678901',
//       reg: 'REG-VEND-001',
//     },
//     {
//       company: 'Global Logistics Ltd',
//       email: 'vendor2@procurehub.com',
//       phone: '+12345678902',
//       reg: 'REG-VEND-002',
//     },
//     {
//       company: 'EcoEnergy Systems',
//       email: 'vendor3@procurehub.com',
//       phone: '+12345678903',
//       reg: 'REG-VEND-003',
//     },
//     {
//       company: 'BuildRight Infrastructure',
//       email: 'vendor4@procurehub.com',
//       phone: '+12345678904',
//       reg: 'REG-VEND-004',
//     },
//     {
//       company: 'Omni Supplies & Services',
//       email: 'vendor5@procurehub.com',
//       phone: '+12345678905',
//       reg: 'REG-VEND-005',
//     },
//     {
//       company: 'CyberGuard Dynamics',
//       email: 'vendor6@procurehub.com',
//       phone: '+12345678906',
//       reg: 'REG-VEND-006',
//     },
//   ];

//   const vendorRecords = [];

//   for (let i = 0; i < vendorConfigs.length; i++) {
//     const config = vendorConfigs[i];
//     const [u] = await db
//       .insert(users)
//       .values({
//         name: `${config.company} Owner`,
//         email: config.email,
//         role: UserRole.VENDOR,
//         password: hashedPassword,
//       })
//       .returning();

//     const [v] = await db
//       .insert(vendor)
//       .values({
//         name: config.company,
//         email: config.email,
//         ownerId: u.id,
//         registrationNumber: config.reg,
//         phoneNumber: config.phone,
//       })
//       .returning();

//     vendorRecords.push(v);
//   }

//   // 7. Create at least 5 Bids for each of the 6 vendors (total 30+ bids)
//   console.log('📝 Creating at least 5 Bids per Vendor...');
//   let bidCount = 0;

//   for (let vIndex = 0; vIndex < vendorRecords.length; vIndex++) {
//     const v = vendorRecords[vIndex];

//     // Pick 5 distinct published tenders for this vendor
//     const assignedTenders = publishedTenders.slice(vIndex * 5, vIndex * 5 + 5);

//     for (let bIndex = 0; bIndex < assignedTenders.length; bIndex++) {
//       const targetTender = assignedTenders[bIndex];
//       const discountRatio = 0.85 + bIndex * 0.03;
//       const bidAmount = Math.round(
//         Number(targetTender?.estimatedValue) * discountRatio,
//       );

//       const statuses = [
//         'pending',
//         'accepted',
//         'rejected',
//         'pending',
//         'pending',
//       ];
//       const status = statuses[bIndex % statuses.length];

//       await db.insert(bid).values({
//         vendorId: v?.id ?? ${i + 1},
//         tenderId: targetTender?.id,
//         amount: bidAmount,
//         bidStatus: status,
//         referenceNumber: `BID-V${v?.id}-T${targetTender?.id}-${100 + bidCount}`,
//         submittedAt: new Date(Date.now() - (bIndex + 1) * 12 * 60 * 60 * 1000),
//       });

//       bidCount++;
//     }
//   }

//   console.log('✅ Seeding completed successfully!');
//   console.log('--------------------------------------------------');
//   console.log('🔑 Seeded Credentials (Password for all: password123)');
//   console.log('👑 SuperAdmin: superadmin@procurehub.com');
//   console.log('👔 Admin 1:   admin1@procurehub.com (20 tenders)');
//   console.log('👔 Admin 2:   admin2@procurehub.com (20 tenders)');
//   console.log(
//     '🏪 Vendors:   vendor1@procurehub.com to vendor6@procurehub.com (5 bids each)',
//   );
//   console.log('--------------------------------------------------');
// }

// seed()
//   .then(() => process.exit(0))
//   .catch((err) => {
//     console.error('❌ Seeding failed:', err);
//     process.exit(1);
//   });
