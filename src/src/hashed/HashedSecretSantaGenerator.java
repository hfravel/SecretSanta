package hashed;

import util.FailedGenerationException;
import util.StringUtil;

import java.util.HashMap;
import java.util.Scanner;

public class HashedSecretSantaGenerator
{
    private static final char DELIMITER = ' ';
    private static final char STOP = 'n';
    
    private int numPeople;
    private HashMap<String, HashedPerson> people;
    private String[] peopleNames;

    public void start()
    {
        Scanner scanner = new Scanner(System.in);
        boolean run = true;
        while (run)
        {
            try
            {
                System.out.print("How many people are there? ");
                numPeople = scanner.nextInt();
                scanner.nextLine();

                System.out.println("Type your people, separated by a single space: ");
                peopleNames = new String[numPeople];
                people = stringToPersonMap(scanner.nextLine(), DELIMITER, numPeople);

                initializeLinks(scanner);

                System.out.println(this);

                generateSecretSantaPairs();
            }
            catch (FailedGenerationException e)
            {
                System.out.println("Ran into the following error, try again:");
                e.printStackTrace();
            }
            finally
            {
                System.out.print("Do you want to go again (y or n)? ");
                if (scanner.nextLine().charAt(0) == STOP)
                    run = false;
            }
        }
    }

    public HashMap<String, HashedPerson> stringToPersonMap(String string, char delimiter, int size) throws FailedGenerationException
    {
        if (string.charAt(0) == delimiter)
            throw new FailedGenerationException("Don't lead with a space");

        HashMap<String, HashedPerson> people = new HashMap<>();
        int count = 0;
        int bit = 1;
        int previous = 0;

        for (int i = 1; i < string.length(); i++)
        {
            if (string.charAt(i) == delimiter)
            {
                if (previous == i)
                    throw new FailedGenerationException("You put two spaces in a row");
                if (count >= size)
                    throw new FailedGenerationException("Too many people: You typed " + count + " people but needed to " + size);

                String name = string.substring(previous, i);
                people.put(name, new HashedPerson(name, bit, size - 1));
                peopleNames[count] = name;
                bit = bit << 1;
                previous = i + 1;
                count++;
            }
        }
        String name = string.substring(previous);
        people.put(name, new HashedPerson(name, bit, size - 1));
        count++;

        if (count != size)
            throw new FailedGenerationException("Too few people: You typed " + count + " people but needed to " + size);

        System.out.println(people);
        return people;
    }
    
    private void initializeLinks(Scanner scanner) throws FailedGenerationException
    {
        for (HashedPerson person : people.values())
        {
            System.out.println("Type the people " + person.getName() + " cannot be assigned to: ");
            generateLink(person, scanner.nextLine());
        }
    }
    
    private void generateLink(HashedPerson mainPerson, String peopleLinks) throws FailedGenerationException
    {
        int count = 0;
        int previous = 0;

        for (int i = 0; i < peopleLinks.length(); i++)
        {
            if (peopleLinks.charAt(i) == DELIMITER)
            {
                if (previous == i)
                    throw new FailedGenerationException("You cannot put two spaces in a row");
                if (count >= numPeople)
                    throw new FailedGenerationException("Too many people: You typed " + count + " people but needed to " + numPeople);

                mainPerson.setLinks(people.get(peopleLinks.substring(previous, i)).getBit());
                count++;
            }
        }
        mainPerson.setLinks(people.get(peopleLinks.substring(previous)).getBit());
    }

    private void generateSecretSantaPairs()
    {

    }

    public String toString()
    {
        StringBuilder output = new StringBuilder();

        for (HashedPerson person : people.values())
        {
            output.append(String.format("%s: bit = %x, links = %x, numAvail = %d\n",
                    person.getName(), person.getBit(), person.getLinks(), person.getNumAvailable()));
        }

        return output.toString();
    }
    
    public static void main(String[] args)
    {
        HashedSecretSantaGenerator secretSantaGenerator = new HashedSecretSantaGenerator();
        secretSantaGenerator.start();
    }
}
