package hashed;

import util.FailedGenerationException;

import java.util.HashMap;
import java.util.Scanner;

public class HashedSecretSantaGenerator
{
    private static final char DELIMITER = ' ';
    private static final char STOP = 'n';

    private HashMap<String, HashedPerson> people;

    public void start()
    {
        Scanner scanner = new Scanner(System.in);
        boolean run = true;
        while (run)
        {
            try
            {
                System.out.println("Type your people, separated by a single space: ");
                people = createPersonMapFromString(scanner.nextLine());
                initializeEachPersonsValidReceivers();

                System.out.println(this);
                promptToRemoveInvalidReceivers(scanner);
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

    public HashMap<String, HashedPerson> createPersonMapFromString(String peopleNames) throws FailedGenerationException
    {
        HashMap<String, HashedPerson> people = new HashMap<>();
        int beginIndexOfName = 0;

        for (int i = 0; i < peopleNames.length(); i++)
        {
            if (peopleNames.charAt(i) == DELIMITER)
            {
                // In case there are multiple delimiters in a row
                if (beginIndexOfName != i)
                {
                    String name = peopleNames.substring(beginIndexOfName, i);
                    people.put(name, new HashedPerson(name));
                }
                beginIndexOfName = i + 1;
            }
        }
        if (beginIndexOfName != peopleNames.length())
        {
            String name = peopleNames.substring(beginIndexOfName);
            people.put(name, new HashedPerson(name));
        }

        return people;
    }

    private void initializeEachPersonsValidReceivers()
    {
        for (HashedPerson person : people.values())
        {
            person.setValidReceivers((HashMap<String, HashedPerson>) people.clone());
            person.removeReceiver(person.getName());
        }
    }
    
    private void promptToRemoveInvalidReceivers(Scanner scanner) throws FailedGenerationException
    {
        for (HashedPerson person : people.values())
        {
            System.out.println("Type the people " + person.getName() + " cannot be assigned to: ");
            removeInvalidReceivers(person, scanner.nextLine());
        }
    }
    
    private void removeInvalidReceivers(HashedPerson person, String invalidReceivers) throws FailedGenerationException
    {
        int beginIndexOfName = 0;

        for (int i = 0; i < invalidReceivers.length(); i++)
        {
            if (invalidReceivers.charAt(i) == DELIMITER)
            {
                // In case there are multiple delimiters in a row
                if (beginIndexOfName != i)
                {
                    String name = invalidReceivers.substring(beginIndexOfName, i);
                    if (people.get(name) == null)
                        throw new FailedGenerationException("No person exists with the name of '" + name + "'.");
                    person.removeReceiver(name);
                }
                beginIndexOfName = i + 1;
            }
        }
        if (beginIndexOfName != invalidReceivers.length())
        {
            String name = invalidReceivers.substring(beginIndexOfName);
            if (people.get(name) == null)
                throw new FailedGenerationException("No person exists with the name of '" + name + "'.");
            person.removeReceiver(name);
        }
    }

    public String toString()
    {
        StringBuilder output = new StringBuilder();

        for (HashedPerson person : people.values())
        {
            output.append(String.format("%s\n", person));
        }

        return output.toString();
    }
    
    public static void main(String[] args)
    {
        HashedSecretSantaGenerator secretSantaGenerator = new HashedSecretSantaGenerator();
        secretSantaGenerator.start();
    }
}
