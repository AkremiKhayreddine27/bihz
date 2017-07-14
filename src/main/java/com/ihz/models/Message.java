package com.ihz.models;

import javax.persistence.*;

@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String from_name;

    private String from_email;

    private String phone;

    private String content;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getFrom_name() {
        return from_name;
    }

    public void setFrom_name(String from_name) {
        this.from_name = from_name;
    }

    public String getFrom_email() {
        return from_email;
    }

    public void setFrom_email(String from_email) {
        this.from_email = from_email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
