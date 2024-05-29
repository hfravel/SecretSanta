package hashed;

import util.FailedGenerationException;
import util.Person;

public class HashedPerson
{
    private String name;
    private int bit;
    private int links;
    private int numAvailable;

    public HashedPerson(String name, int bit, int numAvailable)
    {
        this.name = name;
        this.bit = bit;
        this.numAvailable = numAvailable;
        this.links = bit;
    }

    public String getName()
    {
        return name;
    }

    public int getBit()
    {
        return bit;
    }

    public int getLinks()
    {
        return links;
    }

    public void setLinks(int bit) throws FailedGenerationException
    {
        links = links | bit;
        numAvailable--;

        if (numAvailable < 0)
            throw new FailedGenerationException(name + " was set to " + bit + ", but should not have");
    }

    public int getNumAvailable()
    {
        return numAvailable;
    }
}
