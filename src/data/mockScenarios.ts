export interface ScannedItem {
  id: string;
  hebrew: string;
  literal: string;
  transliteration: string;
  kavana: string;
  tone: string;
  category: string;
  contextExample: string;
  audioText: string;
}

export const mockScenarios: ScannedItem[] = [
  {
    id: '1',
    hebrew: 'מבצע מטורף השבוע',
    literal: 'Crazy operation this week',
    transliteration: 'mivtsa metoraf hashavua',
    kavana: 'This sign is advertising a large promotional sale this week. The word "crazy" (matoraf) is commonly used in Israeli marketing to mean "huge", "unbelievable", or "highly discounted".',
    tone: 'Marketing / Casual',
    category: 'Advertising',
    contextExample: 'יש מבצע מטורף על פירות היום! (Yesh mivtsa metoraf al peirot hayom! - There is a crazy sale on fruits today!)',
    audioText: 'מבצע מטורף השבוע'
  },
  {
    id: '2',
    hebrew: 'חבל על הזמן',
    literal: 'Waste of time',
    transliteration: 'haval al hazman',
    kavana: 'Confusingly, this actually means "Incredible", "Amazing", or "Out of this world" in Israeli slang. It is one of the most common expressions of extreme praise and excitement.',
    tone: 'Slang / Casual',
    category: 'Slang',
    contextExample: 'האוכל במסעדה הזו חבל על הזמן! (Ha-ochel ba-misada hazot haval al hazman! - The food in this restaurant is out of this world!)',
    audioText: 'חבל על הזמן'
  },
  {
    id: '3',
    hebrew: 'במסגרות',
    literal: 'In the frames',
    transliteration: 'ba-misgarot',
    kavana: 'Used in Israel to refer to educational frameworks, after-school programs, childcare, or structured institutions. When parents discuss "misgarot", they are talking about school, nursery, or daycare settings.',
    tone: 'Everyday',
    category: 'Everyday',
    contextExample: 'הילדים כבר במסגרות היום. (Ha-yeladim kvar ba-misgarot hayom. - The kids are already in school/childcare today.)',
    audioText: 'במסגרות'
  },
  {
    id: '4',
    hebrew: 'משא ומתן',
    literal: 'Giving and taking',
    transliteration: 'masa u-matan',
    kavana: 'The standard Hebrew term for business negotiations. It captures the give-and-take dynamic of deal-making in Israeli business culture.',
    tone: 'Professional / Formal',
    category: 'Business',
    contextExample: 'אנחנו במשא ומתן על החוזה החדש. (Anachnu be-masa u-matan al ha-chozeh he-chadash. - We are in negotiations for the new contract.)',
    audioText: 'משא ומתן'
  },
  {
    id: '5',
    hebrew: 'אחרי החגים',
    literal: 'After the holidays',
    transliteration: 'acharei ha-chagim',
    kavana: 'A cultural euphemism meaning "do not expect any work, decision, or bureaucratic progress to happen until the high holidays (September/October) are over". It is the ultimate procrastination phrase in Israeli society.',
    tone: 'Casual / Bureaucratic',
    category: 'Cultural context',
    contextExample: 'נדבר על זה אחרי החגים. (Nedaber al ze acharei ha-chagim. - We will talk about it after the holidays.)',
    audioText: 'אחרי החגים'
  },
  {
    id: '6',
    hebrew: 'אל תהיה פראייר',
    literal: 'Don\'t be a sucker',
    transliteration: 'al tihiye freier',
    kavana: 'The ultimate sin in Israeli culture is being a "freier"—someone who gets taken advantage of, pays too much, or waits in line politely while others cut. Israeli society is heavily geared towards avoiding being a freier.',
    tone: 'Slang / Casual',
    category: 'Slang',
    contextExample: 'אל תהיה פראייר, אל תשלם מחיר מלא. (Al tihiye freier, al teshalem mechir male. - Don\'t be a sucker, don\'t pay full price.)',
    audioText: 'אל תהיה פראייר'
  }
];
