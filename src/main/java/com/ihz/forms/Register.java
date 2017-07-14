package com.ihz.forms;


import com.ihz.validation.PasswordMatches;
import com.ihz.validation.ValidEmail;
import org.hibernate.validator.constraints.NotEmpty;

import javax.validation.constraints.NotNull;


@PasswordMatches
public class Register {

    @NotNull
    @NotEmpty(message = "Le champ nom ne peut pas etre vide")
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @NotNull
    @NotEmpty(message = "Le champ mot de passe ne peut pas etre vide")
    private String password;

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @NotEmpty(message = "Le champ email ne peut pas etre vide")
    @NotNull
    @ValidEmail
    private String email;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    private String matchingPassword;

    public String getMatchingPassword() {
        return matchingPassword;
    }

    public void setMatchingPassword(String matchingPassword) {
        this.matchingPassword = matchingPassword;
    }
}
