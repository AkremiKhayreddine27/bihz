/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.ihz.migration.postgresql;

import org.flywaydb.core.api.migration.spring.SpringJdbcMigration;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;

@Profile("prod")
public class V1_0__InitPostgresqlDatabase implements SpringJdbcMigration {

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
        System.out.println("create notifications table -------------------------------------------------------------------");
        jdbcTemplate.execute(createNotificationsTable());
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
                + "   id serial NOT NULL primary key,\n"
                + "   name VARCHAR(30) NOT NULL,\n"
                + "   email VARCHAR(100) NOT NULL,\n"
                + "   password VARCHAR(100) NOT NULL,\n"
                + "   created_at timestamp,\n"
                + "   updated_at timestamp\n"
                + ");";
    }


    private String createLayersTable() {
        return "CREATE TABLE layers ( \n"
                + "   id serial NOT NULL primary key,\n"
                + "  name varchar(50) NOT NULL, \n"
                + "  color varchar(50) NOT NULL, \n"
                + "  stroke varchar(50) NOT NULL, \n"
                + "  active boolean NOT NULL, \n"
                + "   created_at timestamp,\n"
                + "   updated_at timestamp\n"
                + ");";
    }

    private String createGeoserversTable() {
        return "CREATE TABLE geoservers ( \n"
                + "   id serial NOT NULL primary key,\n"
                + "  url varchar(50) NOT NULL, \n"
                + "  workspace varchar(50) NOT NULL, \n"
                + "  feature_ns varchar(50) NOT NULL, \n"
                + "  src_name varchar(50) NOT NULL, \n"
                + "  layers_primary_key varchar(50) NOT NULL, \n"
                + "  created_at timestamp,\n"
                + "  updated_at timestamp\n"
                + ");";
    }

    private String createNotificationsTable() {
        return "CREATE TABLE notifications ( \n"
                + "   id serial NOT NULL primary key,\n"
                + "  notifiable_id integer NOT NULL, \n"
                + "  notifiable_type varchar(50) NOT NULL, \n"
                + "  data text, \n"
                + "  read_at timestamp,\n"
                + "  created_at timestamp,\n"
                + "  updated_at timestamp\n"
                + ");";
    }

    private String createPostsTable() {
        return "CREATE TABLE posts ( \n"
                + "  id serial NOT NULL primary key, \n"
                + "  title varchar(255) NOT NULL, \n"
                + "  description text NOT NULL, \n"
                + "  user_id integer NOT NULL,\n"
                + "  created_at timestamp,\n"
                + "  updated_at timestamp,\n"
                + "  CONSTRAINT FK_APP_USER FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE\n"
                + ");";
    }

    private String createDocumentsTable() {
        return "CREATE TABLE documents ( \n"
                + "  id serial NOT NULL primary key, \n"
                + "  name varchar(255) NOT NULL, \n"
                + "  path varchar(255) NOT NULL, \n"
                + "  link varchar(255) NOT NULL, \n"
                + "  extension varchar(10) NOT NULL, \n"
                + "  post_id integer NOT NULL,\n"
                + "  created_at timestamp,\n"
                + "  updated_at timestamp,\n"
                + "  CONSTRAINT FK_POST FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE\n"
                + ");";
    }

    private String createMessagesTable() {
        return "CREATE TABLE messages ( \n"
                + "  id serial NOT NULL primary key, \n"
                + "  username varchar(255) NOT NULL, \n"
                + "  email varchar(255) NOT NULL, \n"
                + "  phone varchar(255) NOT NULL, \n"
                + "  content text NOT NULL \n"
                + ");";
    }

    private String createStatisticsTable() {
        return "CREATE TABLE statistics ( \n"
                + "  id serial NOT NULL primary key, \n"
                + "  nappe varchar(255) NOT NULL, \n"
                + "  date varchar(255) NOT NULL, \n"
                + "  type varchar(255) NOT NULL, \n"
                + "  valeur double precision NOT NULL, \n"
                + "  created_at timestamp,\n"
                + "  updated_at timestamp\n"
                + ");";
    }

    private String createRolesTable() {
        return "create table roles(\n"
                + "   id serial NOT NULL primary key,\n"
                + "   name VARCHAR(30) NOT NULL,\n"
                + "   slug VARCHAR(30) NOT NULL\n"
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
                + "    user_id integer NOT NULL,\n"
                + "    role_id integer NOT NULL,\n"
                + "    PRIMARY KEY (user_id, role_id),\n"
                + "    CONSTRAINT FK_APP_USER FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,\n"
                + "    CONSTRAINT FK_USER_PROFILE FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE\n"
                + ");";

    }


    private String createDefaultAdmin() {
        return "INSERT INTO users (id, name, password, email) VALUES"
                + "(1, 'admin', '$2a$10$MvwUYRexceCXTm7CEeD56u8O0ikZ8FF20Z/2H0FhJsCKvHF83RV2W','admin@ihz.tn');";
    }

    private String createAdmin() {
        return "INSERT INTO role_user (user_id, role_id) VALUES (1,1)";
    }

    private String insertGeoserverConfig() {
        return "INSERT INTO geoservers (url,workspace,feature_ns,src_name,layers_primary_key) VALUES ('https://geoserver-tn.herokuapp.com','ihz','http://ihz','EPSG:32632','ID');";
    }

}
