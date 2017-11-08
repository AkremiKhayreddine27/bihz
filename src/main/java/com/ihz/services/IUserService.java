package com.ihz.services;

import com.ihz.forms.Register;
import com.ihz.models.User;
import com.ihz.validation.EmailExistsException;

public interface IUserService {
    User registerNewUserAccount(Register accountDto)
            throws EmailExistsException;
}
