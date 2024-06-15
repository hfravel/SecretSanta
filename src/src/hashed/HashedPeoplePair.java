package hashed;

public class HashedPeoplePair
{
    private final HashedPerson giver;
    private final HashedPerson receiver;

    public HashedPeoplePair(HashedPerson giver, HashedPerson receiver)
    {
        this.giver = giver;
        this.receiver = receiver;
        System.out.println("Creating pair: " + this);
    }

    public HashedPerson getGiver()
    {
        return giver;
    }

    public HashedPerson getReceiver()
    {
        return receiver;
    }

    public String toString()
    {
        return "{'" + giver.getName() + "' -> '" + receiver.getName() + "'}";
    }

}
