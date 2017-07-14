package com.ihz.validation;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import com.ihz.forms.Register;
import com.ihz.models.User;

public class PasswordMatchesValidator implements ConstraintValidator<PasswordMatches, Object> {

    @Override
    public void initialize(final PasswordMatches constraintAnnotation) {
        //
    }

    @Override
    public boolean isValid(final Object obj, final ConstraintValidatorContext context) {
        final Register user = (Register) obj;
        System.out.println(user.getPassword()+" "+user.getMatchingPassword());
        return user.getPassword().equals(user.getMatchingPassword());
    }

}
