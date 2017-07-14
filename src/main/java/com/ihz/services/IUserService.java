package com.ihz.services;

import com.ihz.forms.Register;
import com.ihz.models.User;
import com.ihz.validation.EmailExistsException;

/**
 * Created by Khayreddine on 19/06/2017.
 */
public interface IUserService {
    User registerNewUserAccount(Register accountDto)
            throws EmailExistsException;
}
