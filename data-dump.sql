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
INSERT INTO `bot_listing_category` VALUES (1,1),(2,1),(3,1),(4,1),(5,2),(6,2),(7,1),(8,2),(9,1),(10,1),(11,2),(12,2),(13,2),(14,1),(14,2),(15,1),(16,1),(16,2),(17,1),(18,1),(19,1),(20,1),(21,1),(22,2),(23,1),(23,2),(24,1),(24,2),(25,2),(26,2),(27,1),(28,2),(29,1),(29,2),(30,2),(31,1),(32,1),(33,2),(34,2),(35,1),(35,2),(36,1),(36,2),(37,1),(37,2),(38,1),(39,1),(39,2),(40,2),(41,1),(42,1),(43,2),(44,2),(45,1);
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
  `location` varchar(60) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `activity` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `poi` varchar(60) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `price` smallint(6) DEFAULT NULL,
  `website` varchar(40) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `short_desc` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `imageURL` varchar(200) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bot_listings_db`
--

LOCK TABLES `bot_listings_db` WRITE;
/*!40000 ALTER TABLE `bot_listings_db` DISABLE KEYS */;
INSERT INTO `bot_listings_db` VALUES (1,'ABC Cooking Studio','Cooking Class','Orchard MRT',35,'bit.ly/abccookingSG','Spice up that friendship/relationship with a cooking session! Learn how to prepare items from desserts to a Hamburg Steak. Trial classes run almost every day!','https://res.cloudinary.com/dotogether/image/upload/v1574077945/Listings/ABC%20Cooking%20Studio.jpg'),(2,'Adventure Cove','Day Out','Sentosa',38,'bit.ly/acoveSG','Snorkel over corals, ride water slides or cool off in the pool with a guaranteed enjoyable day, together!','https://res.cloudinary.com/dotogether/image/upload/v1574078267/Listings/Adventure%20Cove.jpg'),(3,'AJ Hackett Sentosa','Bungee Jump','Sentosa',9,'bit.ly/ajhackettSG','THRILLSEEKERS! Dive head first or back flip over the edge of Singapore\'s first bungee jump! Other high-element activities includes a giant swing and a vertical skywalk (facedown!)','https://res.cloudinary.com/dotogether/image/upload/v1574078653/Listings/AJ%20Hackett%20Sentosa.jpg'),(4,'Andsoforth','Interactive Dining',NULL,128,'bit.ly/andsoforthSG','A unique, immersive food experience that involves adventurous stories, surely a bucket list thing.','https://res.cloudinary.com/dotogether/image/upload/v1574335884/Listings/Andsoforth.jpg'),(5,'Bay East Garden','Chill','Promenade MRT (B)',0,NULL,'Admire the beautiful views of Gardens by the bay while basking in the sun. Bring a picnic mat, or a book or a frisbee!','https://res.cloudinary.com/dotogether/image/upload/v1575188811/Listings/Bay%20East%20Garden.jpg'),(6,'Bollywood Veggies','Healthy Eating','Kranji MRT',0,'bit.ly/bveggiesSG','Not a lot of farm-to-table eateries in the Lion City, so don\'t miss the opportunity to indulge in this whole new experience, together!','https://res.cloudinary.com/dotogether/image/upload/v1575188888/Listings/Bollywood%20Veggies%20%281%29.jpg'),(7,'Bollywood Veggies','Tour','Kranji MRT',0,'bit.ly/bveggiesSG','Quit your job, be a farmer They always say — now you can see the farm life for real with this tour!','https://res.cloudinary.com/dotogether/image/upload/v1575189022/Listings/Bollywood%20Veggies%20%282%29.jpg'),(8,'BooksActually','Shopping','Tiong Bahru MRT',0,'bit.ly/booksSG','Let your inner bookworms indulge in this indie bookshop, complete with thoughtful gifts and stationery!','https://res.cloudinary.com/dotogether/image/upload/v1575189130/Listings/BooksActually.jpg'),(9,'Bukit Timah Nature Reserve','Hiking','Beauty World MRT, Hillview MRT',0,'bit.ly/timahSG','Challenge yourselves or just chill out with hikes of varying difficulties, there\'s a trail for everyone to enjoy, together!','https://res.cloudinary.com/dotogether/image/upload/v1575189223/Listings/Bukit%20Timah%20Nature%20Reserve.jpg'),(10,'Canopy Park (JEWEL)','Play','JEWEL Changi Airport',5,'bit.ly/canopySG','Ever wanted to take a walk in the park but SG weather too hot? Now you can pretend you\'re overseas, with this cooling rooftop park spanning the circumference of JEWEL, together!','https://res.cloudinary.com/dotogether/image/upload/v1575189315/Listings/Canopy%20Park%20%28JEWEL%29.jpg'),(11,'Causes For Animals','Volunteer','Fernvale LRT, Yio Chu Kang MRT',0,'bit.ly/animalSG','Have you dreamed of owning a dog with your partner? Fulfill that dream (ish) and maybe something more by volunteering at the shelter, together!','https://res.cloudinary.com/dotogether/image/upload/v1575189416/Listings/Causes%20For%20Animals.jpg'),(12,'Changi Beach','Cycling','Pasir Ris MRT',12,'bit.ly/changibeachSG','Escape the hustle and bustle of city life with a relaxing day out cycling, together!','https://res.cloudinary.com/dotogether/image/upload/v1575189489/Listings/Changi%20Beach.jpg'),(13,'Changi Point Coastal Walk','Stroll','Pasir Ris MRT',0,'bit.ly/coastalSG','Chill out, have a HTHT and enjoy the coastal views from the edge of SG, together.','https://res.cloudinary.com/dotogether/image/upload/v1575189581/Listings/Changi%20Point%20Coastal%20Walk.jpg'),(14,'Chinatown','Walking Tours','Chinatown MRT',0,'bit.ly/walkingtourSG','Get to know iconic SG and discover hidden gems in this area, together!','https://res.cloudinary.com/dotogether/image/upload/v1575189633/Listings/Chinatown.jpg'),(15,'Climb Central','Rock Climbing / Bouldering','Funan Mall, Kallang Wave Mall',22,'bit.ly/climbSG','Train your muscles, shed some weight & strengthen your bonds while rock climbing, together!','https://res.cloudinary.com/dotogether/image/upload/v1575189690/Listings/Climb%20Central.jpg'),(16,'Cloud Forest','Visit','Bayfront MRT',12,'bit.ly/cloudfSG','Learn about the vast diversity in the tropical highlands and enjoy the SIK views from the 35m high indoor mountain, together!','https://res.cloudinary.com/dotogether/image/upload/v1575189762/Listings/Cloud%20Forest.jpg'),(17,'Coast-to-Coast Trail','Hiking',NULL,0,'bit.ly/c2cSG','Something you can definitely brag to your future kids about — walking through the entire country with this coast to coast trail!','https://res.cloudinary.com/dotogether/image/upload/v1575189842/Listings/Coast%20to%20Coast%20Trail.jpg'),(18,'Community Centre','Play Badminton',NULL,NULL,'bit.ly/ActiveBadmintonSG','Bust out your rackets, have fun and exercise, together!','https://res.cloudinary.com/dotogether/image/upload/v1575189891/Listings/Community%20Centre%20Badminton.jpg'),(19,'Cow Play Cow Moo','Playing','Promenade MRT',30,'bit.ly/cowplaycowmooSG','Unleash your inner child at the arcade with your partner, together!','https://res.cloudinary.com/dotogether/image/upload/v1575189990/Listings/Cow%20Play%20Cow%20Moo.jpg'),(20,'Crucycle','Working Out','Outram Park MRT',45,'bit.ly/crucycleSG','Indoor cycling, dark room, cool sweat session — who says working out is boring? (Does anybody say that?)','https://res.cloudinary.com/dotogether/image/upload/v1575190035/Listings/Crucycle.jpg'),(21,'D\'Resort at Downtown East','Kayak to feast','Pasir Ris MRT',NULL,'bit.ly/kayakeatSG','Paddle to SG\'s first floating halal kelong restaurant and enjoy fresh seafood, together!','https://res.cloudinary.com/dotogether/image/upload/v1575190080/Listings/D%27Resort%20at%20Downtown%20East.jpg'),(22,'Decathlon Singapore Lab','Window Shop / Explore','Mountbatten MRT',0,'bit.ly/decathlonlabSG','It\'s open 24/7 and offers a wide range of sport equipment for you to take a swing at! Decide what your next career in sports is going to be here, together!','https://res.cloudinary.com/dotogether/image/upload/v1575190145/Listings/Decathalon%20Lab.jpg'),(23,'Deerfolks Workshop','Embroidery / Sewing Workshop','Sengkang MRT',75,'bit.ly/deerfolksSG','Get your valuable life skill here, while combining some modern aesthetics to your sewn work!','https://res.cloudinary.com/dotogether/image/upload/v1575190232/Listings/Deerfolks%20Workshop.jpg'),(24,'East Coast Park','Cycling','East Coast Park',8,'bit.ly/ecpcycleSG','Don\'t fancy indoor physical activities? Go back to the basics and breathe in the fresh air cycling through ECP, together!','https://res.cloudinary.com/dotogether/image/upload/v1575190308/Listings/East%20Coast%20Park.jpg'),(25,'East Coast Park','Picnic','East Coast Park',0,'bit.ly/ecpcycleSG','Choose your own food, your own mat and your own spot — have a great time eating and watching the waves at ECP, together!','https://res.cloudinary.com/dotogether/image/upload/v1575190308/Listings/East%20Coast%20Park.jpg'),(26,'East Coast Park','Stroll','East Coast Park',0,'bit.ly/ecpcycleSG','Want to just take a breather and reflect on your lives together? Take a stroll in the quaint park and bask in the silence or engaging conversations.','https://res.cloudinary.com/dotogether/image/upload/v1575190308/Listings/East%20Coast%20Park.jpg'),(27,'Fever SG','Kayak Fishing','HarbourFront MRT',199,'bit.ly/feverSG','Combine 2 water activities and you get a fulfilling experience that\'s rarely found anywhere, especially in the city!','https://res.cloudinary.com/dotogether/image/upload/v1575190406/Listings/Fever%20SG.jpg'),(28,'Fish at AMK','Prawning','Yio Chu Kang MRT',15,'bit.ly/fishatamkSG','Late night craving for a good, chill time? Fret not, grab some bait and friends to go prawning together!','https://res.cloudinary.com/dotogether/image/upload/v1575190457/Listings/Fish%20At%20AMK.jpg'),(29,'Flower Dome','Visit','Bayfront MRT',12,'bit.ly/flowerSG','Discover many exotic plant species in this mesmerising air-conditioned glasshouse, together!','https://res.cloudinary.com/dotogether/image/upload/v1575190499/Listings/Flower%20Dome.jpg'),(30,'Fun Empire','Social Painting','Mountbatten MRT',0,'bit.ly/thefunempireSG','Get in touch with your creative sides and express yourselves through the canvas. Bonus: a good, chill time, together!','https://res.cloudinary.com/dotogether/image/upload/v1575190550/Listings/Fun%20Empire.jpg'),(31,'Gallop Stable','Riding Lessons','Sixth Avenue MRT',45,'bit.ly/stableSG','This is Old Town Road IRL, get some lessons and become a horse whisperer today with some riding lessons, together.','https://res.cloudinary.com/dotogether/image/upload/v1575190603/Listings/Gallop%20Stable.jpg'),(32,'Gallop Stable','Horse Rides','Sixth Avenue MRT',10,'bit.ly/stableSG','Have a taste of old school countryside life and ride majestic horses, together!','https://res.cloudinary.com/dotogether/image/upload/v1575190603/Listings/Gallop%20Stable.jpg'),(33,'Gardens By The Bay','Picnic','Bayfront MRT',0,'bit.ly/gardenSG','Pick your favourite foods and unwind with this classic and wholesome activity! (feat. gr8 location)','https://res.cloudinary.com/dotogether/image/upload/v1575190694/Listings/Gardens%20By%20the%20Bay.jpg'),(34,'Gardens By The Bay','Visit','Bayfront MRT',0,'bit.ly/gardenSG','Take a stroll at SG\'s world-famous attraction with the one you love!','https://res.cloudinary.com/dotogether/image/upload/v1575190694/Listings/Gardens%20By%20the%20Bay.jpg'),(35,'Gillman Barracks','Explore','Labrador Park MRT',0,'bit.ly/gillmanSG','Art galleries, cafes and restaurants in the same place. Events happening all year long, 10/10 great time at Gillman Barracks, together!','https://res.cloudinary.com/dotogether/image/upload/v1575190804/Listings/Gillman%20Barracks.jpg'),(36,'Goodman Ceramics Studio','Crockery Making Class','Mountbatten MRT',55,'bit.ly/ceramicSG','Pretend you\'re a master craftsman and create your own masterpiece with this pottery class!','https://res.cloudinary.com/dotogether/image/upload/v1575190875/Listings/Goodman%20Ceramics%20Studio.jpg'),(37,'Graves, Guns and Battles at Battle Box Fort Canning','Walking Tour','Dhoby Ghaut MRT, Fort Canning MRT',38,'bit.ly/battleSG','Discover war-time history right in SG\'s backyard with this immersive experience, together!','https://res.cloudinary.com/dotogether/image/upload/v1575190924/Listings/Battle%20Box%20Fort%20Canning.jpg'),(38,'Hado Singapore','VR Gaming','Scape',6,'bit.ly/hadoasiaSG','Challenge yourselves with co-op games and up your r/s chemistry and teamwork!','https://res.cloudinary.com/dotogether/image/upload/v1575191013/Listings/Hado%20Singapore.jpg'),(39,'Haji Lane','Explore','Bugis MRT',0,'bit.ly/hajilSG','Shoot display pic-worthy shots together with the huge, colourful murals along this lively stretch!','https://res.cloudinary.com/dotogether/image/upload/v1575191092/Listings/Haji%20Lane.jpg'),(40,'Haji Lane','Shop','Bugis MRT',0,'bit.ly/hajilSG','Explore this indie neighbourhood littered with trinkets and specialty items from independent stores!','https://res.cloudinary.com/dotogether/image/upload/v1575191092/Listings/Haji%20Lane.jpg'),(41,'Hay Dairies Goat Farm','Animal Visit','Lim Chu Kang Area',0,'bit.ly/dairiesSG','Catch some goat milking action, feed them & bring home fresh milk!','https://res.cloudinary.com/dotogether/image/upload/v1575191203/Listings/Hay%20Dairies%20Goat%20Farm.jpg'),(42,'Headrock VR','VR Gaming','Sentosa',35,'bit.ly/headrockSG','Face your fears (but not really; virtually) in SG\'s largest VR theme park & bond with your partner!','https://res.cloudinary.com/dotogether/image/upload/v1575191298/Listings/Headrock%20VR.jpg'),(43,'Hedge Maze (JEWEL)','Stroll','JEWEL Changi Airport',11,'bit.ly/hedgeSG','Weave thru SG\'s largest hedge maze in JEWEL\'s huge air-conditioned rooftop canopy park!','https://res.cloudinary.com/dotogether/image/upload/v1575191362/Listings/Hedge%20Maze%20%28JEWEL%29.jpg'),(44,'Henderson Waves','Chill','Mount Faber Park',0,'bit.ly/southernSG','There\'s a reason why many aesthetic videos are filmed at the Henderson Waves. It\'s the perfect place to chill out and catch the sunset with the company you love!','https://res.cloudinary.com/dotogether/image/upload/v1575191427/Listings/Henderson%20Waves.jpg'),(45,'Holey Moley Golf Club','Mini-Golfing','Fort Canning MRT',25,'bit.ly/holeymoleySG','Go mini-golfing in various themed courses at Holey Moley, and have a load of fun, together!','https://res.cloudinary.com/dotogether/image/upload/v1575191546/Listings/Holey%20Moley.jpg');
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

-- Dump completed on 2019-12-01 20:44:09
