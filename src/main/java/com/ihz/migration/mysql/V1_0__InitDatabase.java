/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.ihz.migration.mysql;

import org.flywaydb.core.api.migration.spring.SpringJdbcMigration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class V1_0__InitDatabase implements SpringJdbcMigration {




    @Override
    public void migrate(JdbcTemplate jdbcTemplate) throws Exception {
        System.out.println("Create users table -------------------------------------------------------------------");
        jdbcTemplate.execute(createUsersTable());
        System.out.println("Create roles table ---------------------------------------------------------------");
        jdbcTemplate.execute(createRolesTable());
        jdbcTemplate.execute(insertUserProfile_USER());
        jdbcTemplate.execute(insertUserProfile_ADMIN());
        System.out.println("create role_user table ------------------------------------------------------");
        jdbcTemplate.execute(createAppUserUserProfileTable());
        System.out.println("create layers Table ---------------------------------------------------------------------");
        jdbcTemplate.execute(createLayersTable());
        System.out.println("create geoservers Table -------------------------------------------------------------------");
        jdbcTemplate.execute(createGeoserversTable());
        System.out.println("configuring geoserver -------------------------------------------------------------------");
        jdbcTemplate.execute(insertGeoserverConfig());
        System.out.println("create posts table -------------------------------------------------------------------");
        jdbcTemplate.execute(createPostsTable());
        System.out.println("create documents table -------------------------------------------------------------------");
        jdbcTemplate.execute(createDocumentsTable());
        System.out.println("create messages table -------------------------------------------------------------------");
        jdbcTemplate.execute(createMessagesTable());
        System.out.println("create statistics table -------------------------------------------------------------------");
        jdbcTemplate.execute(createStatisticsTable());
        System.out.println("create Admin ----------------------------------------------------------------------------");
        jdbcTemplate.execute(createDefaultAdmin());
        jdbcTemplate.execute(createAdmin());

    }

    private String createUsersTable() {
        return "create table users (\n"
                + "   id BIGINT NOT NULL AUTO_INCREMENT,\n"
                + "   name VARCHAR(30) NOT NULL,\n"
                + "   email VARCHAR(100) NOT NULL,\n"
                + "   password VARCHAR(100) NOT NULL,\n"
                + "   created_at timestamp,\n"
                + "   updated_at timestamp,\n"
                + "   PRIMARY KEY (id),\n"
                + "   UNIQUE (name)\n"
                + ");";
    }

    private String createLayersTable() {
        return "CREATE TABLE layers ( \n"
                + "  id int(11) NOT NULL AUTO_INCREMENT, \n"
                + "  name varchar(50) NOT NULL, \n"
                + "  color varchar(50) NOT NULL, \n"
                + "  stroke varchar(50) NOT NULL, \n"
                + "  active boolean NOT NULL, \n"
                + "   PRIMARY KEY (id),\n"
                + "   UNIQUE (name)\n"
                + ");";
    }

    private String createGeoserversTable() {
        return "CREATE TABLE geoservers ( \n"
                + "  id int(11) NOT NULL AUTO_INCREMENT, \n"
                + "  url varchar(50) NOT NULL, \n"
                + "  workspace varchar(50) NOT NULL, \n"
                + "  feature_ns varchar(50) NOT NULL, \n"
                + "  src_name varchar(50) NOT NULL, \n"
                + "  layers_primary_key varchar(50) NOT NULL, \n"
                + "  PRIMARY KEY (id)\n"
                + ");";
    }

    private String createNotificationsTable() {
        return "CREATE TABLE notifications ( \n"
                + "  id int(11) NOT NULL AUTO_INCREMENT, \n"
                + "  notifiable_id int(11) NOT NULL, \n"
                + "  notifiable_type varchar(50) NOT NULL, \n"
                + "  data text NOT NULL, \n"
                + "  read_at timestamp,\n"
                + "  created_at timestamp,\n"
                + "  updated_at timestamp,\n"
                + "  PRIMARY KEY (id)\n"
                + ");";
    }

    private String createPostsTable() {
        return "CREATE TABLE posts ( \n"
                + "  id int(11) NOT NULL AUTO_INCREMENT, \n"
                + "  title varchar(255) NOT NULL, \n"
                + "  description text NOT NULL, \n"
                + "  user_id BIGINT NOT NULL,\n"
                + "  created_at timestamp,\n"
                + "  updated_at timestamp,\n"
                + "  CONSTRAINT FK_APP_USER FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,\n"
                + "  PRIMARY KEY (id)\n"
                + ");";
    }

    private String createStatisticsTable() {
        return "CREATE TABLE statistics ( \n"
                + "  id int(11) NOT NULL AUTO_INCREMENT, \n"
                + "  nappe varchar(255) NOT NULL, \n"
                + "  date varchar(255) NOT NULL, \n"
                + "  type varchar(255) NOT NULL, \n"
                + "  valeur double NOT NULL, \n"
                + "  created_at timestamp,\n"
                + "  updated_at timestamp,\n"
                + "  PRIMARY KEY (id)\n"
                + ");";
    }


    private String createDocumentsTable() {
        return "CREATE TABLE documents ( \n"
                + "  id int(11) NOT NULL AUTO_INCREMENT, \n"
                + "  name varchar(255) NOT NULL, \n"
                + "  path varchar(255) NOT NULL, \n"
                + "  link varchar(255) NOT NULL, \n"
                + "  extension varchar(10) NOT NULL, \n"
                + "  post_id BIGINT NOT NULL,\n"
                + "  created_at timestamp,\n"
                + "  updated_at timestamp,\n"
                + "  CONSTRAINT FK_POST FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,\n"
                + "  PRIMARY KEY (id)\n"
                + ");";
    }

    private String createMessagesTable() {
        return "CREATE TABLE messages ( \n"
                + "  id int(11) NOT NULL AUTO_INCREMENT, \n"
                + "  from_name varchar(255) NOT NULL, \n"
                + "  from_email varchar(255) NOT NULL, \n"
                + "  phone varchar(255) NOT NULL, \n"
                + "  content text NOT NULL, \n"
                + "  PRIMARY KEY (id)\n"
                + ");";
    }

    private String createRolesTable() {
        return "create table roles(\n"
                + "   id BIGINT NOT NULL AUTO_INCREMENT,\n"
                + "   name VARCHAR(30) NOT NULL,\n"
                + "   slug VARCHAR(30) NOT NULL,\n"
                + "   PRIMARY KEY (id),\n"
                + "   UNIQUE (name)\n"
                + ");";
    }

    private String insertUserProfile_USER() {
        return "INSERT INTO roles (name,slug) VALUES ('Administrateur','administrateur');";
    }

    private String insertUserProfile_ADMIN() {
        return "INSERT INTO roles (name,slug) VALUES ('Éditeur','éditeur');";
    }

    private String createAppUserUserProfileTable() {
        return "CREATE TABLE role_user (\n"
                + "    user_id BIGINT NOT NULL,\n"
                + "    role_id BIGINT NOT NULL,\n"
                + "    PRIMARY KEY (user_id, role_id),\n"
                + "    CONSTRAINT FK_APP_USER FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,\n"
                + "    CONSTRAINT FK_USER_PROFILE FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE\n"
                + ");";

    }


    private String createDefaultAdmin() {
        BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
        return "INSERT INTO users (id, name, password, email) VALUES"
                + "(1, 'admin', '"+ bCryptPasswordEncoder.encode("admin")+"','admin@ihz.tn');";
    }

    private String createAdmin() {
        return "INSERT INTO role_user (user_id, role_id) VALUES (1,1)";
    }


    private String insertGeoserverConfig() {
        return "INSERT INTO geoservers (url,workspace,feature_ns,src_name,layers_primary_key) VALUES ('http://localhost:8080/geoserver','ihz','http://ihz','EPSG:32632','ID');";
    }

}
