CREATE DATABASE  IF NOT EXISTS `ENPH479` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `ENPH479`;
-- MySQL dump 10.13  Distrib 5.6.13, for osx10.6 (i386)
--
-- Host: 127.0.0.1    Database: ENPH479
-- ------------------------------------------------------
-- Server version	5.6.14

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `timeplay_data`
--

DROP TABLE IF EXISTS `timeplay_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `timeplay_data` (
  `db_id` int(11) NOT NULL AUTO_INCREMENT,
  `region` int(11) NOT NULL,
  `timestamp` varchar(45) NOT NULL,
  `sentiment` double NOT NULL,
  `weather` double NOT NULL,
  PRIMARY KEY (`db_id`),
  UNIQUE KEY `db_id_UNIQUE` (`db_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2041 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timeplay_data`
--

LOCK TABLES `timeplay_data` WRITE;
/*!40000 ALTER TABLE `timeplay_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `timeplay_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tweet_data`
--

DROP TABLE IF EXISTS `tweet_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tweet_data` (
  `db_id` int(11) NOT NULL AUTO_INCREMENT,
  `id` int(11) NOT NULL,
  `timestamp` varchar(45) NOT NULL,
  `lat` double NOT NULL,
  `lng` double NOT NULL,
  `sensor_id` int(11) NOT NULL,
  `sensor_name` varchar(45) NOT NULL,
  `message` varchar(1000) CHARACTER SET utf8mb4 NOT NULL,
  `value` int(11) NOT NULL,
  `sentimentPolarity` int(11) NOT NULL,
  `weatherScore` double NOT NULL,
  `region` varchar(45) NOT NULL,
  PRIMARY KEY (`db_id`),
  UNIQUE KEY `id_UNIQUE` (`db_id`)
) ENGINE=InnoDB AUTO_INCREMENT=428 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tweet_data`
--

LOCK TABLES `tweet_data` WRITE;
/*!40000 ALTER TABLE `tweet_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `tweet_data` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-11-13 13:28:49
