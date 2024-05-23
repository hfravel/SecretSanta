public class Person
{
    public String name;
    public Person[] links;
    public int number;
    public int numAvailable;

    public Person(String name)
    {
        this.name = name;
        links = new Person[0];
    }

    public Person(String name, Person[] links)
    {
        this.name = name;
        this.links = links;
    }
}
