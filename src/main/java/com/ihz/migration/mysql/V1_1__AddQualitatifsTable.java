package com.ihz.migration.mysql;

import org.flywaydb.core.api.migration.spring.SpringJdbcMigration;
import org.springframework.jdbc.core.JdbcTemplate;

/**
 * Created by Khayreddine on 06/07/2017.
 */
public class V1_1__AddQualitatifsTable implements SpringJdbcMigration {


    @Override
    public void migrate(JdbcTemplate jdbcTemplate) throws Exception {
        System.out.println("create qualitatifs table -------------------------------------------------------------------");
        jdbcTemplate.execute(createQualitatifsTable());
    }

    private String createQualitatifsTable() {
        return "CREATE TABLE qualitatifs ( \n"
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

}
