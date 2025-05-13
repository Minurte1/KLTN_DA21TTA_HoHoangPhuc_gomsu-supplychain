-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: gom_su
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `ID_CART` int NOT NULL AUTO_INCREMENT,
  `ID_PRODUCT` int NOT NULL,
  `ID_USERS` int NOT NULL,
  `CREATED_AT_CART` datetime DEFAULT NULL,
  `ID_COMPANY` int DEFAULT NULL,
  PRIMARY KEY (`ID_CART`),
  KEY `FK_CART_ASSOCIATI_PRODUCTS` (`ID_PRODUCT`),
  KEY `FK_CART_ASSOCIATI_USERS` (`ID_USERS`),
  CONSTRAINT `FK_CART_ASSOCIATI_PRODUCTS` FOREIGN KEY (`ID_PRODUCT`) REFERENCES `products` (`ID_PRODUCT`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_CART_ASSOCIATI_USERS` FOREIGN KEY (`ID_USERS`) REFERENCES `users` (`ID_USERS`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `ID_CATEGORIES_` int NOT NULL AUTO_INCREMENT,
  `NAME_CATEGORIES_` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID_CATEGORIES_`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `ID_COMPANY` int NOT NULL AUTO_INCREMENT,
  `NAME_COMPANY` varchar(255) NOT NULL,
  `TYPE_COMPANY` varchar(50) DEFAULT NULL,
  `ADDRESS` varchar(255) DEFAULT NULL,
  `DIA_CHI_Provinces` varchar(100) DEFAULT NULL,
  `DIA_CHI_Districts` varchar(100) DEFAULT NULL,
  `DIA_CHI_Wards` varchar(100) DEFAULT NULL,
  `DIA_CHI_STREETNAME` varchar(255) DEFAULT NULL,
  `PHONE` varchar(50) DEFAULT NULL,
  `EMAIL` varchar(255) DEFAULT NULL,
  `AVATAR` varchar(255) DEFAULT NULL,
  `SLUG` varchar(255) DEFAULT NULL,
  `CREATED_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `UPDATED_AT` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `STATUS` varchar(50) DEFAULT 'ACTIVE',
  `ID_COMPANY_TYPE` int DEFAULT NULL,
  PRIMARY KEY (`ID_COMPANY`),
  UNIQUE KEY `SLUG` (`SLUG`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES (1,'ádasd','ádádsd','','','','','','','','asd','','2025-05-13 01:03:02','2025-05-13 01:18:53','ACTIVEa',2),(3,'ádasd','ádádsd','ádas','aáád','đâs','ádasd','đáádasd','232','áasd','asd','ádasd','2025-05-13 01:13:00','2025-05-13 01:13:00','ACTIVEa',1);
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `company_types`
--

DROP TABLE IF EXISTS `company_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `company_types` (
  `ID_COMPANY_TYPE` int NOT NULL AUTO_INCREMENT,
  `NAME_COMPANY_TYPE` varchar(50) NOT NULL,
  PRIMARY KEY (`ID_COMPANY_TYPE`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `company_types`
--

LOCK TABLES `company_types` WRITE;
/*!40000 ALTER TABLE `company_types` DISABLE KEYS */;
INSERT INTO `company_types` VALUES (1,'ádasdasd'),(2,'111');
/*!40000 ALTER TABLE `company_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipment`
--

DROP TABLE IF EXISTS `equipment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipment` (
  `ID_EQUIPMENT` int NOT NULL AUTO_INCREMENT,
  `NAME_EQUIPMENT` varchar(255) DEFAULT NULL,
  `TYPE_EQUIPMENT` varchar(255) DEFAULT NULL,
  `STATUS` varchar(255) DEFAULT NULL,
  `LAST_MAINTENANCE` varchar(255) DEFAULT NULL,
  `CREATED_AT` datetime DEFAULT NULL,
  `UPDATED_AT` datetime DEFAULT NULL,
  PRIMARY KEY (`ID_EQUIPMENT`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipment`
--

LOCK TABLES `equipment` WRITE;
/*!40000 ALTER TABLE `equipment` DISABLE KEYS */;
/*!40000 ALTER TABLE `equipment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `ID_INVENTORY_` int NOT NULL AUTO_INCREMENT,
  `ID_MATERIALS_` int NOT NULL,
  `QUANTITY_INVENTORY` int DEFAULT NULL,
  `LAST_UPDATED_` datetime DEFAULT NULL,
  `STORAGE_CONDITION` varchar(255) DEFAULT NULL,
  `ID_COMPANY` int DEFAULT NULL,
  PRIMARY KEY (`ID_INVENTORY_`),
  KEY `FK_INVENTOR_ASSOCIATI_MATERIAL` (`ID_MATERIALS_`),
  CONSTRAINT `FK_INVENTOR_ASSOCIATI_MATERIAL` FOREIGN KEY (`ID_MATERIALS_`) REFERENCES `materials` (`ID_MATERIALS_`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material_orders`
--

DROP TABLE IF EXISTS `material_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material_orders` (
  `ID_MATERIAL_ORDER` int NOT NULL AUTO_INCREMENT,
  `ID_MATERIALS_` int NOT NULL,
  `ID_SUPPLIERS` int NOT NULL,
  `QUANTITY_ORDERED` int DEFAULT NULL,
  `ORDER_DATE` datetime DEFAULT NULL,
  `DELIVERY_DATE` datetime DEFAULT NULL,
  `STATUS` varchar(255) DEFAULT NULL,
  `TOTAL_COST` float DEFAULT NULL,
  `ID_COMPANY` int DEFAULT NULL,
  PRIMARY KEY (`ID_MATERIAL_ORDER`),
  KEY `FK_MATERIAL_ORDERS_ASSOCIATI_SUPPLIER` (`ID_SUPPLIERS`),
  KEY `FK_MATERIAL_ORDERS_ASSOCIATI_MATERIAL` (`ID_MATERIALS_`),
  CONSTRAINT `FK_MATERIAL_ORDERS_ASSOCIATI_MATERIAL` FOREIGN KEY (`ID_MATERIALS_`) REFERENCES `materials` (`ID_MATERIALS_`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_MATERIAL_ORDERS_ASSOCIATI_SUPPLIER` FOREIGN KEY (`ID_SUPPLIERS`) REFERENCES `suppliers` (`ID_SUPPLIERS`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material_orders`
--

LOCK TABLES `material_orders` WRITE;
/*!40000 ALTER TABLE `material_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `material_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `material_types`
--

DROP TABLE IF EXISTS `material_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `material_types` (
  `ID_MATERIAL_TYPES` int NOT NULL AUTO_INCREMENT,
  `NAME_MATERIAL_TYPES` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID_MATERIAL_TYPES`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `material_types`
--

LOCK TABLES `material_types` WRITE;
/*!40000 ALTER TABLE `material_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `material_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materials`
--

DROP TABLE IF EXISTS `materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `materials` (
  `ID_MATERIALS_` int NOT NULL AUTO_INCREMENT,
  `ID_MATERIAL_TYPES` int NOT NULL,
  `NAME_` varchar(255) DEFAULT NULL,
  `UNIT_` varchar(255) DEFAULT NULL,
  `COST_PER_UNIT_` float DEFAULT NULL,
  `CREATED_AT_PRODUCTS` datetime DEFAULT NULL,
  `UPDATED_AT_PRODUCTS` datetime DEFAULT NULL,
  `ORIGIN` varchar(255) DEFAULT NULL,
  `EXPIRY_DATE` datetime DEFAULT NULL,
  `ID_COMPANY` int DEFAULT NULL,
  PRIMARY KEY (`ID_MATERIALS_`),
  KEY `FK_MATERIAL_ASSOCIATI_MATERIAL_TYPE` (`ID_MATERIAL_TYPES`),
  CONSTRAINT `FK_MATERIAL_ASSOCIATI_MATERIAL_TYPE` FOREIGN KEY (`ID_MATERIAL_TYPES`) REFERENCES `material_types` (`ID_MATERIAL_TYPES`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materials`
--

LOCK TABLES `materials` WRITE;
/*!40000 ALTER TABLE `materials` DISABLE KEYS */;
/*!40000 ALTER TABLE `materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `ID_ORDER_ITEMS` int NOT NULL AUTO_INCREMENT,
  `ID_PRODUCT` int NOT NULL,
  `ID_ORDERS_` int NOT NULL,
  `QUANTITY_INVENTORY` int DEFAULT NULL,
  `PRICE_ORDER_ITEMS` float DEFAULT NULL,
  `ID_COMPANY` int DEFAULT NULL,
  PRIMARY KEY (`ID_ORDER_ITEMS`),
  KEY `FK_ORDER_IT_ASSOCIATI_ORDERS` (`ID_ORDERS_`),
  KEY `FK_ORDER_IT_ASSOCIATI_PRODUCTS` (`ID_PRODUCT`),
  CONSTRAINT `FK_ORDER_IT_ASSOCIATI_ORDERS` FOREIGN KEY (`ID_ORDERS_`) REFERENCES `orders` (`ID_ORDERS_`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_ORDER_IT_ASSOCIATI_PRODUCTS` FOREIGN KEY (`ID_PRODUCT`) REFERENCES `products` (`ID_PRODUCT`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `ID_ORDERS_` int NOT NULL AUTO_INCREMENT,
  `ID_USERS` int NOT NULL,
  `DATE_ORDER` datetime DEFAULT NULL,
  `TOTAL_AMOUNT_ORDER` float DEFAULT NULL,
  `PAYMENT_STATUS_ORDER` varchar(255) DEFAULT NULL,
  `SHIPPING_STATUS_ORDER` varchar(255) DEFAULT NULL,
  `SHIPPING_ADDRESS` varchar(255) DEFAULT NULL,
  `SHIPPING_METHOD` varchar(255) DEFAULT NULL,
  `SHIPPING_COST` varchar(255) DEFAULT NULL,
  `ID_COMPANY` int DEFAULT NULL,
  PRIMARY KEY (`ID_ORDERS_`),
  KEY `FK_ORDERS_ASSOCIATI_USERS` (`ID_USERS`),
  CONSTRAINT `FK_ORDERS_ASSOCIATI_USERS` FOREIGN KEY (`ID_USERS`) REFERENCES `users` (`ID_USERS`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `production_materials`
--

DROP TABLE IF EXISTS `production_materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `production_materials` (
  `ID_PRODUCT_MATERIALS` int NOT NULL AUTO_INCREMENT,
  `ID_PRODUCTION_PLANS` int NOT NULL,
  `ID_MATERIALS_` int NOT NULL,
  `QUANTITY_PER_UNIT_PRODUCT_MATERIALS` float DEFAULT NULL,
  `UNIT_PRODUCT_MATERIALS` varchar(255) DEFAULT NULL,
  `ID_COMPANY` int DEFAULT NULL,
  PRIMARY KEY (`ID_PRODUCT_MATERIALS`),
  KEY `FK_PRODUCTI_ASSOCIATI_MATERIAL` (`ID_MATERIALS_`),
  KEY `FK_PRODUCTION_MATERIALS_PRODUCTION_PLANS` (`ID_PRODUCTION_PLANS`),
  CONSTRAINT `FK_PRODUCTI_ASSOCIATI_MATERIAL` FOREIGN KEY (`ID_MATERIALS_`) REFERENCES `materials` (`ID_MATERIALS_`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_PRODUCTION_MATERIALS_PRODUCTION_PLANS` FOREIGN KEY (`ID_PRODUCTION_PLANS`) REFERENCES `production_plans` (`ID_PRODUCTION_PLANS`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `production_materials`
--

LOCK TABLES `production_materials` WRITE;
/*!40000 ALTER TABLE `production_materials` DISABLE KEYS */;
/*!40000 ALTER TABLE `production_materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `production_plans`
--

DROP TABLE IF EXISTS `production_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `production_plans` (
  `ID_PRODUCTION_PLANS` int NOT NULL AUTO_INCREMENT,
  `ID_PRODUCT` int NOT NULL,
  `ID_USERS` int NOT NULL,
  `PLANNED_START_PRODUCTION_PLANS` datetime DEFAULT NULL,
  `PLANNED_END_PRODUCTION_PLANS` datetime DEFAULT NULL,
  `ACTUAL_START_PRODUCTION_PLANS` datetime DEFAULT NULL,
  `ACTUAL_END_PRODUCTION_PLANS` datetime DEFAULT NULL,
  `STATUS_PRODUCTION_PLANS` varchar(255) DEFAULT NULL,
  `NOTE_PRODUCTION_PLANS` text,
  `ID_COMPANY` int DEFAULT NULL,
  PRIMARY KEY (`ID_PRODUCTION_PLANS`),
  KEY `FK_PRODUCTI_ASSOCIATI_USERS` (`ID_USERS`),
  KEY `FK_PRODUCTI_ASSOCIATI_PRODUCTS` (`ID_PRODUCT`),
  CONSTRAINT `FK_PRODUCTI_ASSOCIATI_PRODUCTS` FOREIGN KEY (`ID_PRODUCT`) REFERENCES `products` (`ID_PRODUCT`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_PRODUCTI_ASSOCIATI_USERS` FOREIGN KEY (`ID_USERS`) REFERENCES `users` (`ID_USERS`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `production_plans`
--

LOCK TABLES `production_plans` WRITE;
/*!40000 ALTER TABLE `production_plans` DISABLE KEYS */;
/*!40000 ALTER TABLE `production_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `production_steps`
--

DROP TABLE IF EXISTS `production_steps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `production_steps` (
  `ID_PRODUCTION_STEPS_` int NOT NULL AUTO_INCREMENT,
  `ID_PRODUCTION_PLANS` int NOT NULL,
  `ID_USERS` int NOT NULL,
  `ID_EQUIPMENT` int NOT NULL,
  `STEP_NAME_PRODUCTION_STEPS` varchar(255) DEFAULT NULL,
  `START_TIME_PRODUCTION_STEPS` datetime DEFAULT NULL,
  `END_TIME_PRODUCTION_STEPS` datetime DEFAULT NULL,
  `STATUS_PRODUCTION_STEPS` varchar(255) DEFAULT NULL,
  `ID_COMPANY` int DEFAULT NULL,
  PRIMARY KEY (`ID_PRODUCTION_STEPS_`),
  KEY `FK_PRODUCTION_STEPS_PRODUCTION_PLANS` (`ID_PRODUCTION_PLANS`),
  KEY `FK_PRODUCTION_STEPS_USERS` (`ID_USERS`),
  KEY `FK_PRODUCTION_STEPS_EQUIPMENT` (`ID_EQUIPMENT`),
  CONSTRAINT `FK_PRODUCTI_ASSOCIATI_EQUIPMEN` FOREIGN KEY (`ID_EQUIPMENT`) REFERENCES `equipment` (`ID_EQUIPMENT`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_PRODUCTION_STEPS_PRODUCTION_PLANS` FOREIGN KEY (`ID_PRODUCTION_PLANS`) REFERENCES `production_plans` (`ID_PRODUCTION_PLANS`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `FK_PRODUCTION_STEPS_USERS` FOREIGN KEY (`ID_USERS`) REFERENCES `users` (`ID_USERS`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `production_steps`
--

LOCK TABLES `production_steps` WRITE;
/*!40000 ALTER TABLE `production_steps` DISABLE KEYS */;
/*!40000 ALTER TABLE `production_steps` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `ID_PRODUCT` int NOT NULL AUTO_INCREMENT,
  `ID_CATEGORIES_` int NOT NULL,
  `NAME_PRODUCTS` varchar(255) DEFAULT NULL,
  `DESCRIPTION_PRODUCTS` varchar(255) DEFAULT NULL,
  `PRICE_PRODUCTS` float DEFAULT NULL,
  `STOCK_PRODUCTS` int DEFAULT NULL,
  `IMAGE_URL_PRODUCTS` varchar(255) DEFAULT NULL,
  `CREATED_AT_PRODUCTS` datetime DEFAULT NULL,
  `UPDATED_AT_PRODUCTS` datetime DEFAULT NULL,
  `ID_COMPANY` int DEFAULT NULL,
  PRIMARY KEY (`ID_PRODUCT`),
  KEY `FK_PRODUCTS_ASSOCIATI_CATEGORI` (`ID_CATEGORIES_`),
  CONSTRAINT `FK_PRODUCTS_ASSOCIATI_CATEGORI` FOREIGN KEY (`ID_CATEGORIES_`) REFERENCES `categories` (`ID_CATEGORIES_`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quality_control`
--

DROP TABLE IF EXISTS `quality_control`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quality_control` (
  `ID_QUALITY_CONTROL` int NOT NULL AUTO_INCREMENT,
  `ID_PRODUCTION_STEPS_` int NOT NULL,
  `ID_PRODUCT` int NOT NULL,
  `ID_USERS` int NOT NULL,
  `CHECK_DATE` datetime DEFAULT NULL,
  `RESULT` varchar(255) DEFAULT NULL,
  `NOTE` text,
  `ID_COMPANY` int DEFAULT NULL,
  PRIMARY KEY (`ID_QUALITY_CONTROL`),
  KEY `FK_QUALITY__ASSOCIATI_PRODUCTI` (`ID_PRODUCTION_STEPS_`),
  CONSTRAINT `FK_QUALITY__ASSOCIATI_PRODUCTI` FOREIGN KEY (`ID_PRODUCTION_STEPS_`) REFERENCES `production_steps` (`ID_PRODUCTION_STEPS_`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quality_control`
--

LOCK TABLES `quality_control` WRITE;
/*!40000 ALTER TABLE `quality_control` DISABLE KEYS */;
/*!40000 ALTER TABLE `quality_control` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `ID_ROLE` int NOT NULL AUTO_INCREMENT,
  `NAME_ROLE` varchar(255) DEFAULT NULL,
  `LIST_PERMISION` longtext,
  `IS_DELETE` tinyint(1) DEFAULT NULL,
  `CODE_NAME` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`ID_ROLE`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'Quản trị viên','\"[{\\\"router\\\":\\\"dashboard\\\",\\\"actions\\\":[\\\"access\\\"]},{\\\"router\\\":\\\"role\\\",\\\"actions\\\":[\\\"view\\\",\\\"create\\\",\\\"update\\\",\\\"delete\\\"]},{\\\"router\\\":\\\"user\\\",\\\"actions\\\":[\\\"view\\\",\\\"create\\\",\\\"update\\\",\\\"delete\\\"]},{\\\"router\\\":\\\"company\\\",\\\"actions\\\":[\\\"view\\\",\\\"create\\\",\\\"update\\\",\\\"delete\\\"]},{\\\"router\\\":\\\"company_type\\\",\\\"actions\\\":[\\\"view\\\",\\\"create\\\",\\\"update\\\",\\\"delete\\\"]},{\\\"router\\\":\\\"order_item\\\",\\\"actions\\\":[\\\"create\\\"]}]\"',0,'ADMIN'),(2,'Nhân viên kho','[\n  {\"router\": \"product\", \"actions\": [\"view\"]},\n  {\"router\": \"order\", \"actions\": [\"view\", \"update\"]}\n]',0,'WAREHOUSE'),(3,'Nhân viên bán hàng','[\n  {\"router\": \"order\", \"actions\": [\"view\", \"update\", \"ship\"]},\n  {\"router\": \"user\", \"actions\": [\"view\"]}\n]',0,'SALES'),(6,'asdasdasdas','',NULL,'dasdasd'),(7,'áda','',NULL,'dasdasd'),(8,'áda','',NULL,'sdasdasd'),(9,'áda111','',NULL,'ádasd11'),(10,'asdasd','',1,'asdasd'),(13,'LIST_PERMISION','\"[{\\\"router\\\":\\\"role\\\",\\\"actions\\\":[\\\"view\\\",\\\"create\\\",\\\"update\\\",\\\"delete\\\"]},{\\\"router\\\":\\\"user\\\",\\\"actions\\\":[\\\"view\\\",\\\"create\\\",\\\"update\\\",\\\"delete\\\"]},{\\\"router\\\":\\\"product\\\",\\\"actions\\\":[\\\"view\\\",\\\"create\\\",\\\"update\\\",\\\"delete\\\"]},{\\\"router\\\":\\\"dashboard\\\",\\\"actions\\\":[\\\"access\\\"]},{\\\"router\\\":\\\"order\\\",\\\"actions\\\":[\\\"view\\\",\\\"update\\\",\\\"ship\\\"]}]\"',0,'LIST_PERMISION'),(16,'Khách hàng','[]',0,'CUSTOMER');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `suppliers` (
  `ID_SUPPLIERS` int NOT NULL AUTO_INCREMENT,
  `NAME_PRODUCTS` varchar(255) DEFAULT NULL,
  `ADDRESS_SUPPLIERS` varchar(255) DEFAULT NULL,
  `PHONE_SUPPLIERS` int DEFAULT NULL,
  `EMAIL_SUPPLIERS` varchar(255) DEFAULT NULL,
  `CREATED_AT_SUPPLIERS` datetime DEFAULT NULL,
  `UPDATED_AT_SUPPLIERS` datetime DEFAULT NULL,
  `STATUS_SUPPLIERS` varchar(255) DEFAULT NULL,
  `ID_COMPANY` int DEFAULT NULL,
  PRIMARY KEY (`ID_SUPPLIERS`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transport_orders`
--

DROP TABLE IF EXISTS `transport_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transport_orders` (
  `ID_TRANSPORT_ORDER` int NOT NULL AUTO_INCREMENT,
  `ID_COMPANY` int DEFAULT NULL,
  `ID_MATERIAL_ORDER` int DEFAULT NULL,
  `ID_ORDER` int DEFAULT NULL,
  `DELIVERY_DATE` datetime DEFAULT NULL,
  `STATUS` varchar(100) DEFAULT NULL,
  `SHIPPING_COST` float DEFAULT NULL,
  `CREATED_AT` datetime DEFAULT CURRENT_TIMESTAMP,
  `UPDATED_AT` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `NOTE` text,
  PRIMARY KEY (`ID_TRANSPORT_ORDER`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transport_orders`
--

LOCK TABLES `transport_orders` WRITE;
/*!40000 ALTER TABLE `transport_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `transport_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `ID_USERS` int NOT NULL AUTO_INCREMENT,
  `ID_ROLE` int NOT NULL,
  `HO_TEN` varchar(255) DEFAULT NULL,
  `EMAIL` varchar(255) DEFAULT NULL,
  `_PASSWORD_HASH_USERS` varchar(255) DEFAULT NULL,
  `SO_DIEN_THOAI` varchar(20) DEFAULT NULL,
  `IS_ACTIVE_USERS` varchar(255) DEFAULT NULL,
  `NGAY_TAO_USER` datetime DEFAULT NULL,
  `NGAY_CAP_NHAT_USER` datetime DEFAULT NULL,
  `IS_DELETE_USERS` varchar(255) DEFAULT NULL,
  `AVATAR` varchar(255) DEFAULT NULL,
  `DIA_CHI_Provinces` varchar(100) DEFAULT NULL,
  `DIA_CHI_Districts` varchar(100) DEFAULT NULL,
  `DIA_CHI_Wards` varchar(100) DEFAULT NULL,
  `DIA_CHI_STREETNAME` varchar(255) DEFAULT NULL,
  `TRANG_THAI_USER` enum('ACTIVE','INACTIVE','DELETED') DEFAULT 'ACTIVE',
  `ID_COMPANY` int DEFAULT NULL,
  PRIMARY KEY (`ID_USERS`),
  KEY `FK_USERS_ASSOCIATI_ROLE` (`ID_ROLE`),
  CONSTRAINT `FK_USERS_ASSOCIATI_ROLE` FOREIGN KEY (`ID_ROLE`) REFERENCES `role` (`ID_ROLE`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (5,1,'Phúc Hoàng','hohoangphucjob@gmail.com',NULL,NULL,NULL,'2025-05-09 15:19:28','2025-05-09 15:19:28','0',NULL,NULL,NULL,NULL,NULL,'ACTIVE',NULL),(6,16,'Phucvntv159','phucvntv159@gmail.com',NULL,NULL,NULL,'2025-05-09 16:23:16','2025-05-09 16:23:16','0',NULL,NULL,NULL,NULL,NULL,'ACTIVE',NULL),(7,16,'Hồ Hoàng Phúc','hohoangphucdev@gmail.com',NULL,NULL,NULL,'2025-05-09 16:24:34','2025-05-09 16:24:34','0',NULL,NULL,NULL,NULL,NULL,'ACTIVE',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-14  0:33:19
