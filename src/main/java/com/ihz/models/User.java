package com.ihz.models;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ihz.validation.PasswordMatches;
import com.ihz.validation.ValidEmail;
import org.hibernate.validator.constraints.NotEmpty;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Entity
@Table(name = "users")
@DiscriminatorValue("user")
public class User implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "NAME", nullable = false)
    private String name;

    @Column(name = "PASSWORD", nullable = false)
    private String password;

    @Column(name = "EMAIL", nullable = false)
    private String email;


    @ManyToMany
    @JoinTable(
            name = "role_user",
            joinColumns = @JoinColumn(
                    name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(
                    name = "role_id", referencedColumnName = "id"))
    private Set<Role> roles = new HashSet<Role>();


    @OneToMany(mappedBy = "user",cascade = CascadeType.ALL)
    @JsonIgnore
    private Collection<Post> posts;


    public Integer getId() {
        return id;
    }


    public String getPassword() {
        return password;
    }


    public String getName() {
        return name;
    }


    public String getEmail() {
        return email;
    }

    public Set<Role> getRoles() {
        return roles;
    }


    public void setId(Integer id) {
        this.id = id;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }


    public Collection<Post> getPosts() {
        return posts;
    }

    public void setPosts(Collection<Post> posts) {
        this.posts = posts;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (!(obj instanceof User)) {
            return false;
        }
        User other = (User) obj;
        if (id == null) {
            if (other.id != null) {
                return false;
            }
        } else if (!id.equals(other.id)) {
            return false;
        }
        return true;
    }
}
