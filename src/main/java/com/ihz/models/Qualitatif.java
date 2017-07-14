package com.ihz.models;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.util.Date;

@Entity
@Table(name = "qualitatifs")
public class Qualitatif {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotEmpty(message = "Le champ nappe ne peut pas etre vide")
    private String nappe;

    @NotEmpty(message = "Le champ date ne peut pas etre vide")
    private String date;

    @NotEmpty(message = "Le champ type ne peut pas etre vide")
    private String type;

    @NotEmpty(message = "Le champ valeur ne peut pas etre vide")
    @Pattern(regexp = "[+-]?([0-9]*[.])?[0-9]+", message = "Le champ valeur doit etre un nombre")
    private String valeur;

    @Temporal(TemporalType.TIMESTAMP)
    @Type(type = "date")
    @CreationTimestamp
    private Date created_at;

    @Temporal(TemporalType.TIMESTAMP)
    @UpdateTimestamp
    private Date updated_at;


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNappe() {
        return nappe;
    }

    public void setNappe(String nappe) {
        this.nappe = nappe;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getValeur() {
        return valeur;
    }

    public void setValeur(String valeur) {
        this.valeur = valeur;
    }

    public Date getCreated_at() {
        return created_at;
    }

    public void setCreated_at(Date created_at) {
        this.created_at = created_at;
    }

    public Date getUpdated_at() {
        return updated_at;
    }

    public void setUpdated_at(Date updated_at) {
        this.updated_at = updated_at;
    }
}
