-- MySQL dump 10.13  Distrib 8.0.15, for macos10.14 (x86_64)
--
-- Host: localhost    Database: together_bot
-- ------------------------------------------------------
-- Server version	8.0.15

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8mb4 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bot_category`
--

DROP TABLE IF EXISTS `bot_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `bot_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_name` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `category_name` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bot_category`
--

LOCK TABLES `bot_category` WRITE;
/*!40000 ALTER TABLE `bot_category` DISABLE KEYS */;
INSERT INTO `bot_category` VALUES (1,'Adventurous'),(2,'Chill'),(3,'Home');
/*!40000 ALTER TABLE `bot_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bot_listing_category`
--

DROP TABLE IF EXISTS `bot_listing_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `bot_listing_category` (
  `bot_listing_id` int(11) NOT NULL,
  `bot_category_id` int(11) NOT NULL,
  KEY `bot_listing_id` (`bot_listing_id`),
  KEY `bot_category_id` (`bot_category_id`),
  CONSTRAINT `bot_listing_category_ibfk_1` FOREIGN KEY (`bot_listing_id`) REFERENCES `bot_listings_db` (`id`),
  CONSTRAINT `bot_listing_category_ibfk_2` FOREIGN KEY (`bot_category_id`) REFERENCES `bot_category` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bot_listing_category`
--

LOCK TABLES `bot_listing_category` WRITE;
/*!40000 ALTER TABLE `bot_listing_category` DISABLE KEYS */;
INSERT INTO `bot_listing_category` VALUES (1,1),(2,1),(3,1);
/*!40000 ALTER TABLE `bot_listing_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bot_listings_db`
--

DROP TABLE IF EXISTS `bot_listings_db`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `bot_listings_db` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `location` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `activity` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `poi` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `price` smallint(6) DEFAULT NULL,
  `website` varchar(40) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `short_desc` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `imageURL` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bot_listings_db`
--

LOCK TABLES `bot_listings_db` WRITE;
/*!40000 ALTER TABLE `bot_listings_db` DISABLE KEYS */;
INSERT INTO `bot_listings_db` VALUES (1,'ABC Cooking Studio','Cooking Class','Funan, Taka, Westgate',35,'bit.ly/abccookingSG','Spice up that friendship/relationship with a cooking session! Learn how to prepare items from desserts to a Hamburg Steak. Food recipes crafted by professional Japanese Chefs. Trial classes run almost every day!','https://res.cloudinary.com/dotogether/image/upload/v1574077945/Listings/ABC%20Cooking%20Studio.jpg'),(2,'Adventure Cove','Day Out','Sentosa',38,'bit.ly/acoveSG','Snorkel over corals, ride water slides or cool off in the pool with a guaranteed enjoyable day, together.!','https://res.cloudinary.com/dotogether/image/upload/v1574078267/Listings/Adventure%20Cove.jpg'),(3,'AJ Hackett Sentosa','Bungee Jump','Sentosa',9,'bit.ly/ajhackettSG','THRILLSEEKERS! Dive head first or back flip over the edge of Singapore\'s first bungee jump! Other high-element activities includes a giant swing and a vertical skywalk (facedown!)','https://res.cloudinary.com/dotogether/image/upload/v1574078653/Listings/AJ%20Hackett%20Sentosa.jpg');
/*!40000 ALTER TABLE `bot_listings_db` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bot_user_db`
--

DROP TABLE IF EXISTS `bot_user_db`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `bot_user_db` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chat_id` int(11) NOT NULL,
  `first_name` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `username` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_type` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date_joined` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bot_user_db`
--

LOCK TABLES `bot_user_db` WRITE;
/*!40000 ALTER TABLE `bot_user_db` DISABLE KEYS */;
/*!40000 ALTER TABLE `bot_user_db` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-11-19 22:06:16
