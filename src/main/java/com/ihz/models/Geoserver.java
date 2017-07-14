package com.ihz.models;


import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.util.Date;


@Entity
@Table(name = "geoservers")
public class Geoserver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String url;

    private String workspace;

    private String feature_ns;

    private String src_name;

    private String layers_primary_key;


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getWorkspace() {
        return workspace;
    }

    public void setWorkspace(String workspace) {
        this.workspace = workspace;
    }

    public String getFeature_ns() {
        return feature_ns;
    }

    public void setFeature_ns(String feature_ns) {
        this.feature_ns = feature_ns;
    }

    public String getSrc_name() {
        return src_name;
    }

    public void setSrc_name(String src_name) {
        this.src_name = src_name;
    }

    public String getLayers_primary_key() {
        return layers_primary_key;
    }

    public void setLayers_primary_key(String layers_primary_key) {
        this.layers_primary_key = layers_primary_key;
    }

}
