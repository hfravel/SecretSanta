package hashed;

import crude.PeoplePair;
import util.FailedGenerationException;

import java.util.HashMap;
import java.util.Random;
import java.util.Scanner;

public class HashedSecretSantaGenerator
{
    private static final char DELIMITER = ' ';
    private static final char STOP = 'n';
    private static final Random RANDOM = new Random();

    private HashMap<String, HashedPerson> people;
    private HashMap<String, HashedPerson> completedPeople;
    private HashedPeoplePair[] secretSantaPairing;

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
                completedPeople = new HashMap<>();
                initializeEachPersonsValidReceivers();

                promptToRemoveInvalidReceivers(scanner);
                System.out.println(this);

                secretSantaPairing = new HashedPeoplePair[people.size()];

                int pairingCount = 0;
                while (pairingCount < secretSantaPairing.length)
                {
                    HashedPerson[] matchingGroup = findMatchingGroups();
                    if (matchingGroup != null)
                    {
                        System.out.println("Matching Group: " + matchingGroup.length);
                        randomlyCreatePairs(matchingGroup);
                        pairingCount += matchingGroup.length;
                    }
                    else
                    {
                        System.out.println("Single Person");
                        pairFirstPerson();
                        pairingCount++;
                    }
                }

                System.out.println(peoplePairToString(secretSantaPairing));
            }
            catch (FailedGenerationException e)
            {
                System.out.println("Ran into the following error, try again:");
                e.printStackTrace();
            }

            System.out.print("Do you want to go again (y or n)? ");
            if (scanner.nextLine().charAt(0) == STOP)
                run = false;
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

    private HashedPerson[] findMatchingGroups() throws FailedGenerationException
    {
        HashedPerson[] peopleWithTheSameReceivers;
        int peopleCount;

        for (HashedPerson person1 : people.values())
        {
            peopleCount = 1;
            peopleWithTheSameReceivers = new HashedPerson[person1.getValidReceivers().size()];

            for (HashedPerson person2 : people.values())
            {
                if (person1 != person2 && person2.getValidReceivers().equals(person1.getValidReceivers()))
                {
                    if (peopleCount == person1.getValidReceivers().size())
                        throw new FailedGenerationException("Cannot create Secret Santa, too few connections");

                    peopleWithTheSameReceivers[peopleCount] = person2;
                    peopleCount++;
                }
            }

            if (peopleCount == person1.getValidReceivers().size())
            {
                peopleWithTheSameReceivers[0] = person1;
                return peopleWithTheSameReceivers;
            }
        }

        return null;
    }

    private void randomlyCreatePairs(HashedPerson[] givingPeople) throws FailedGenerationException
    {
        HashMap<String, HashedPerson> validReceivers = givingPeople[0].getValidReceivers();
        int count = givingPeople.length;

        if (count != validReceivers.size())
            throw new FailedGenerationException("Amount of Givers (" + count + ") vs Receivers ("
                    + validReceivers.size() + ") does not match");

        for (HashedPerson receiver : validReceivers.values())
        {
            int randomIndex = RANDOM.nextInt(count);
            HashedPerson giver = givingPeople[randomIndex];
            secretSantaPairing[completedPeople.size()] = new HashedPeoplePair(giver, receiver);

            completedPeople.put(giver.getName(), people.remove(giver.getName()));
            removePersonFromAllReceivingGroups(receiver.getName());

            count--;
            givingPeople[randomIndex] = givingPeople[count];
        }
    }

    private void pairFirstPerson() throws FailedGenerationException
    {
        String name = people.keySet().iterator().next();
        HashedPerson giver = people.remove(name);

        HashedPerson receiver = chooseRandomPerson(giver.getValidReceivers());
        if (receiver == null)
            throw new FailedGenerationException("Unable to find a receiver for " + name);
        removePersonFromAllReceivingGroups(receiver.getName());

        secretSantaPairing[completedPeople.size()] = new HashedPeoplePair(giver, receiver);
        completedPeople.put(name, giver);
    }

    private HashedPerson chooseRandomPerson(HashMap<String, HashedPerson> hashedPeople)
    {
        int randomIndex = RANDOM.nextInt(hashedPeople.size());
        for (HashedPerson person : hashedPeople.values())
        {
            if (randomIndex == 0)
                return person;
            randomIndex--;
        }

        return null;
    }

    private void removePersonFromAllReceivingGroups(String name)
    {
        for (HashedPerson person : people.values())
        {
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

    private static String peoplePairToString(HashedPeoplePair[] peoplePairs)
    {
        StringBuilder stringBuilder = new StringBuilder();
        for (HashedPeoplePair peoplePair : peoplePairs)
        {
            stringBuilder.append(peoplePair).append("\n");
        }

        return stringBuilder.toString();
    }
}
