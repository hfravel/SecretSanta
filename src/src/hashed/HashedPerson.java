package hashed;

import crude.Person;
import util.FailedGenerationException;

import java.util.HashMap;

public class HashedPerson
{
    private final String name;
    private HashMap<String, HashedPerson> validReceivers;

    public HashedPerson(String name)
    {
        this.name = name;
        validReceivers = null;
    }

    public String getName()
    {
        return name;
    }

    public void setValidReceivers(HashMap<String, HashedPerson> validReceivers)
    {
        this.validReceivers = validReceivers;
    }

    public HashMap<String, HashedPerson> getValidReceivers()
    {
        return validReceivers;
    }

    public void removeReceiver(String name)
    {
        validReceivers.remove(name);
    }

    public String toString()
    {
        return "{Name=" + name + "; Receivers=" + (validReceivers == null ? "null" : validReceivers.keySet()) + "}";
    }
}
