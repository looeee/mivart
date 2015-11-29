<?php

/**
 * ProcessWire Configuration File
 *
 * Site-specific configuration for ProcessWire
 * 
 * Please see the file /wire/config.php which contains all configuration options you may
 * specify here. Simply copy any of the configuration options from that file and paste
 * them into this file in order to modify them. 
 * 
 * SECURITY NOTICE
 * In non-dedicated environments, you should lock down the permissions of this file so 
 * that it cannot be seen by other users on the system. For more information, please 
 * see the config.php section at: https://processwire.com/docs/security/file-permissions/
 *
 * ProcessWire 2.x 
 * Copyright (C) 2015 by Ryan Cramer 
 * This file licensed under Mozilla Public License v2.0 (http://mozilla.org/MPL/2.0/)
 * 
 * https://processwire.com
 *
 */

if(!defined("PROCESSWIRE")) die();

/*** SITE CONFIG *************************************************************************/

/**
 * Enable debug mode?
 *
 * Debug mode causes additional info to appear for use during dev and debugging.
 * This is almost always recommended for sites in development. However, you should
 * always have this disabled for live/production sites.
 *
 * @var bool
 *
 */
$config->debug = false;

/**
 * Prepend template file
 *
 * PHP file in /site/templates/ that will be loaded before each page's template file.
 * Example: _init.php
 *
 * @var string
 *
 */
$config->prependTemplateFile = '_init.php';


/*** INSTALLER CONFIG ********************************************************************/

/**
 * Installer: Database Configuration
 * 
 */
$config->dbHost = 'localhost';
$config->dbName = 'mivart';
$config->dbUser = 'root';
$config->dbPass = 'm1sspell';
$config->dbPort = '3306';

/**
 * Installer: User Authentication Salt 
 * 
 * Must be retained if you migrate your site from one server to another
 * 
 */
$config->userAuthSalt = 'b8acb7277a83e6d3e3e5e34a6aeede79'; 

/**
 * Installer: File Permission Configuration
 * 
 */
$config->chmodDir = '0777'; // permission for directories created by ProcessWire
$config->chmodFile = '0666'; // permission for files created by ProcessWire 

/**
 * Installer: Time zone setting
 * 
 */
$config->timezone = 'Europe/Dublin';


/**
 * Installer: HTTP Hosts Whitelist
 * 
 */
$config->httpHosts = array('vps222373.ovh.net');


/**
 * Installer: Database Configuration
 * 
 */
$config->dbHost = 'localhost';
$config->dbName = 'mivart';
$config->dbUser = 'root';
$config->dbPass = 'm1sspell';
$config->dbPort = '3306';

/**
 * Installer: User Authentication Salt 
 * 
 * Must be retained if you migrate your site from one server to another
 * 
 */
$config->userAuthSalt = '5df3fe44c1996af78b8b20838717ab20'; 

/**
 * Installer: File Permission Configuration
 * 
 */
$config->chmodDir = '0777'; // permission for directories created by ProcessWire
$config->chmodFile = '0666'; // permission for files created by ProcessWire 

/**
 * Installer: Time zone setting
 * 
 */
$config->timezone = 'Europe/Dublin';


/**
 * Installer: HTTP Hosts Whitelist
 * 
 */
$config->httpHosts = array('vps222373.ovh.net');


/**
 * Installer: Database Configuration
 * 
 */
$config->dbHost = 'localhost';
$config->dbName = 'mivart';
$config->dbUser = 'root';
$config->dbPass = 'm1sspell';
$config->dbPort = '3306';

/**
 * Installer: User Authentication Salt 
 * 
 * Must be retained if you migrate your site from one server to another
 * 
 */
$config->userAuthSalt = '35c3e79f92af14bb7cdec37875d24b26'; 

/**
 * Installer: File Permission Configuration
 * 
 */
$config->chmodDir = '0777'; // permission for directories created by ProcessWire
$config->chmodFile = '0666'; // permission for files created by ProcessWire 

/**
 * Installer: Time zone setting
 * 
 */
$config->timezone = 'Europe/Dublin';


/**
 * Installer: HTTP Hosts Whitelist
 * 
 */
$config->httpHosts = array('vps222373.ovh.net');


/**
 * Installer: Database Configuration
 * 
 */
$config->dbHost = 'localhost';
$config->dbName = 'mivart';
$config->dbUser = 'root';
$config->dbPass = 'm1sspell';
$config->dbPort = '3306';

/**
 * Installer: User Authentication Salt 
 * 
 * Must be retained if you migrate your site from one server to another
 * 
 */
$config->userAuthSalt = 'a19d651fb90f1b9c70d52f8c4896d320'; 

/**
 * Installer: File Permission Configuration
 * 
 */
$config->chmodDir = '0777'; // permission for directories created by ProcessWire
$config->chmodFile = '0666'; // permission for files created by ProcessWire 

/**
 * Installer: Time zone setting
 * 
 */
$config->timezone = 'Europe/Dublin';


/**
 * Installer: HTTP Hosts Whitelist
 * 
 */
$config->httpHosts = array('vps222373.ovh.net');


/**
 * Installer: Database Configuration
 * 
 */
$config->dbHost = 'localhost';
$config->dbName = 'mivart';
$config->dbUser = 'root';
$config->dbPass = 'm1sspell';
$config->dbPort = '3306';

/**
 * Installer: User Authentication Salt 
 * 
 * Must be retained if you migrate your site from one server to another
 * 
 */
$config->userAuthSalt = '333bfc41930f521e4315c4391b368a09'; 

/**
 * Installer: File Permission Configuration
 * 
 */
$config->chmodDir = '0777'; // permission for directories created by ProcessWire
$config->chmodFile = '0666'; // permission for files created by ProcessWire 

/**
 * Installer: Time zone setting
 * 
 */
$config->timezone = 'Europe/Dublin';


/**
 * Installer: HTTP Hosts Whitelist
 * 
 */
$config->httpHosts = array('vps222373.ovh.net');


/**
 * Installer: Database Configuration
 * 
 */
$config->dbHost = 'localhost';
$config->dbName = 'mivart';
$config->dbUser = 'root';
$config->dbPass = 'm1sspell';
$config->dbPort = '3306';

/**
 * Installer: User Authentication Salt 
 * 
 * Must be retained if you migrate your site from one server to another
 * 
 */
$config->userAuthSalt = 'a9f5ddcf2c126f8110415f361f3351a3'; 

/**
 * Installer: File Permission Configuration
 * 
 */
$config->chmodDir = '0777'; // permission for directories created by ProcessWire
$config->chmodFile = '0666'; // permission for files created by ProcessWire 

/**
 * Installer: Time zone setting
 * 
 */
$config->timezone = 'Europe/Dublin';


/**
 * Installer: HTTP Hosts Whitelist
 * 
 */
$config->httpHosts = array('vps222373.ovh.net');

