package com.ihz.storage;

/**
 * Created by Khayreddine on 08/05/2017.
 */
public class StorageFileNotFoundException extends StorageException{
    public StorageFileNotFoundException(String message) {
        super(message);
    }

    public StorageFileNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
