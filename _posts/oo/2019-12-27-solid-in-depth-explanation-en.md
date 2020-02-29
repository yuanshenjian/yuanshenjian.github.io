---
layout: post

title: "SOLID entrepreneurial story of Mr. Object-Oriented"
date: 2019-12-27
categories: [OOD]
tag: [Object-Oriented Design]

author: "袁慎建"
published: true

brief: "
After doing so many years of Object-Oriented programming, I still write code that violates the SOLID principles. I understand it at a glance, but am embarrassed when coding. The understanding of SOLID is not enough. What should I do?
<br/><br/>
SOLID principles are usually abstract, Even developers experienced in OO may not have a solid grasp of the SOLID principles, let alone those new in OO.To improve the sensitivity to SOLID principles, the first step is to be clear what are each the principles. In this article, Mr Yuan's SOLID entrepreneurial story will unveil the principles.
"

---

* content
{:toc}


Main members Introduction:

- Mr. Yuan: boss, alias Mr. Object-Oriented, Referred to as Yuan
- Ms. Wu, Ms. Cai, Mr. Xiao, Mr. Shi, Mr Fa, Ms. Ren, Mr. Xing, employees



After doing so many years of Object-Oriented programming, I still write code that violates the SOLID principles. I understand it at a glance, but am embarrassed when coding. The understanding of SOLID is not enough. What should I do?

- Are the SOLID principles flawed?
- Can I use it with object oriented design?
- ......

First off, let's see what is SOLID:

- SRP: Single Responsibility Principle
- OCP: Open Close Principle
- LSP: Liskov Substitution Principle
- ISP: Interface Segregation Principle
- DIP: Dependency Inversion Principle

SOLID principles are usually abstract, Even developers experienced in OO may not have a solid grasp of the SOLID principles, let alone those new in OO.To improve the sensitivity to SOLID principles, the first step is to be clear what are each the principles. In this article, Mr Yuan's SOLID entrepreneurial story will unveil the principles.

---

## Designing a small and beautiful toolbox to enhance customer experience

Yuan has a metal tool rental store. In the early days of the business, he had  two types of customers. Type A customers needed scissors, hammers, wrenches, and chainsaws. Type B customers needed hammers, wrenches, fruit knives, and screwdrivers. For convenience, Yuan would put the six tools in a single toolbox, and rented the toolbox to both types of customers.

Yuan received complaints from those customers after several rentals, because it caused them much trouble. Firstly, having extra two tools made the toolbox heavy and the customers were more exhausted carrying it. Secondly, after they went back home, they would get confused: "What are these two tools, I didn’t borrow them? Are the extra tools value added service? But how should I use it?" Finally, Type A customers, who had never used the fruit knife and the screwdriver, but he had to maintain and take care of the extra two tools, which was inconvenient. Similarly, Type B customers faced the same problem.

To improve the customers' experience, Yuan separated the big tool box into two smaller tool boxes based on customers' needs, and rented them to A and B respectively. After that, he received favorable feedback from both types of customers.

***[Interpretation of ISP]***

**In software design, ISP advocates not providing a large and comprehensive interface to users, but isolating the interfaces that each user really cares about.**

![]({{ site.url }}{{ site.img_path }}{{ '/oo/en/ood-isp.jpg' }})

---

## Assure customers that apprentices can work in place of masters

Yuan worked diligently for two years and earned a lot of money. When he saw the rise of the real estate market and the home improvement market, he decisively bought a well-known furniture factory and cooperated with a private carpenter firm.

SJ was a carpenter apprentice working in the carpenter firm. After more than three years of learning, he was able to make the same furniture as his master, like bookshelves, wardrobes, dining tables, doors, windows and other furniture

Each time Yuan would work directly with SJ’s master. However, due to the master’s poor physical strength, he would delegate some work to SJ. Fortunately, the furniture made by SJ each time satisfied Yuan. After several collaborations, Yuan believed that the apprentice had inherited the master’s craftsmanship, and whatever the master could make, the apprentice would be able to make as well.

In 2017, the real estate market was crazily bullish, and the number of Yuan's one-time purchase orders doubled. In order to deliver on time, a more junior carpenter apprentice of SJ’s master, Y, started participating in projects. Unfortunately, Y created closets, doors and windows in a very different way from the master ’s style. The furniture made by Y made Yuan disappointed and angry. After that, Yuan ceased cooperation with this carpenter firm...

***[Interpretation of LSP]***

**Although Y inherited his master's craftsmanship, he would modify the design styles by himself. As a result, the furniture he created was totally different from what Yuan expected. This is similar to how the subclass instance replaces the parent class instance and introduces behavior inconsistent behavior of the parent class, causing the software to be buggy. There are potential problems with this kind of inheritance design.**

**In software design, LSP emphasizes that, consumers that use a parent class must be able to use a subclass too, and the behavior should be the same.**


**In short, a subclass should not change the existing behavior of the parent class (In Java, it shows that subclass overrides the non-abstract methods in the parent class). If inconsistency occurs after substituting a subclass for the parent class, you need to be vigilant about whether the inheritance is a suitable design.**


**A client uses a furniture factory as an abstraction on different workers (different implementation of the master) and in order to get an excellent table a client has only one way: check which master is working on his table, in other words, the client has to check `instance of worker` that violates good design principles.**

![]({{ site.url }}{{ site.img_path }}{{ '/oo/en/ood-lsp.jpg' }})

---

## Clear and good cooperation agreements, which builds each other’s trust

After the last unpleasant cooperation, Yuan not only earned less money but also got angry. Nonetheless, in those several years when the real estate market was completely crazy, Yuan made several fortunes. What would Yuan do with so much money? Of course, expand the company to earn more money.

Adhered to the principle that "Although the sparrow is small, its internal organs cannot be incomplete."(Chinese proverb, it means that small but complete in every detail) , Yuan established several departments - finance, legal, administrative, human resources, marketing and sales. Due to the small business volume, each department contains a single member. The four departments of human resources, administration, finance and legal apartment were under the sole control of Ms. Cai.

Yuan would go directly to Ms. Cai to check a reimbursement form, or hold an annual meeting. If he wanted to know the last month’s sales performance, he would find Mr. Xiao in the sales department. For marketing, he would seek Mr. Shi from the marketing department.

After more than half a year of rapid development, the number of people in each department grew. Yuan continued doing things the same way as before but quickly encountered trouble. You see, the day before yesterday, Ms. Cai was in charge of the reimbursement, but yesterday it was handled by Ms. Wu, and today it became Ms. Ren. The same phenomenon had occurred in other departments. After much consideration, Yuan decided that each head of the department needs to make a fixed list of all the services that the department provides. For example, the service list provided by Ms.Cai from the finance department would look like this:

- Check reimbursement forms
- Process reimbursements
- Pay wages
- Recruit new colleagues
- Review performance
- Hold annual meetings
- Review business licenses

So, if Yuan wanted to deal with reimbursement or pay wages, he can just communicate with Ms. Cai. As for who is doing the work, Yuan did not need to care at all. Certainly, it was much easier for other departments to cooperate with the finance department. Since then, the same process was similarly established in all departments.

Yuan finally enjoyed the perks of being a boss. Before getting off work, he typed this down: The departments must cooperate through agreed agreements, instead of caring about who is responsible for the agreements within.

***[Interpretation of DIP]***

**In the beginning, Yuan went directly to a specific executive in the department to communicate. It means that Yuan relied on the specific implementation details. The communication cost increased every time the executive changed. Later on, he asked Ms. Cai to provide a service list. Here, Ms. Cai acted as an abstraction or interface. After that, he only communicated with Ms. Cai. Yuan changed from relying on specific implementation details to relying on abstraction.**


**In software design, DIP advocates that users rely on an abstract service interface, instead of relying on a specific service executor. From relying on a concrete implementation to relying on an abstract interface. That is what "inversion" means.**

![]({{ site.url }}{{ site.img_path }}{{ '/oo/en/ood-dip.jpg' }})

---

## Improve work efficiency by single responsibility

Yuan initially assigned Ms.Cai as the head of the four departments of human resources, administration, finance and legal. After the business expanded, he only recruited 10 more people for these departments. Ms. Cai felt very stressed because she had to assign tasks properly to each colleague to ensure that the company can carry out daily activities, personnel assessment, and training and payroll. Also, there are some sensitive activities like business audits, account review and information security audits.



Ms Cai was clearly tired. There was once she made a blunder at work that almost caused the company to go under.



One day, several people from the Administration for Industry and Commerce(AIC) came to the company to review the company's business qualifications. During the discussion between Ms. Cai and AIC manager, two other colleagues had a little dispute because of  data that could not be tallied. These two completely forgot that there were investigators from AIC. Some sensitive information related to the account was mentioned during in dispute. Fortunately, Ms. Cai reacted quickly and stopped them in time. She also managed to pacify AIC.



Later Yuan heard about the incident. Ms. Cai  had, on numerous occasions,  also gave feedback to Yuan that business was too complex; it was not only tiring, but also easy to make mistakes. Yuan decided to let each department be headed by different staff. He assigned Ms. Ren to head the human resource department,  Mr. Xing to head the administrative department, and Mr. Fa to head the legal department.  Ms Cai remained as the head of the finance department.



After a few months, Yuan was delighted that the cost of operating has not risen yet employees’ work status has improved..

From then on, Ms. Cai, from the finance department, provided the list of services:

- Check reimbursement forms
- Process reimbursements
- Pay wages

Ms. Ren, from human resource department, provided the list of services:

- Recruit new staff
- Review performance
- Staff development

Mr. Xing, from the administrative department, provided the list of services:

- Hold annual meeting
- Receive guests

Mr. Fa, from the legal department, provided the list of services:

- Review business licenses
- Audit information security


At 10 pm on Friday, Yuan stepped out of the office door. He hummed and said to himself: specialists have to do specialised things. Don’t be greedy and overload, else there will be blunders.


Before going to bed, Yuan turned on his laptop and typed down the memo: Separating the points of focus is an effective way to do a single thing. If you need to take care of many unrelated tasks at the same time, context switching will greatly reduce work efficiency. It will greatly reduce work efficiency. Worse still, there may be some unexpected disasters. After typing these, he was pleased and went to sleep.

***[Interpretation of SRP]***

**In software design, SRP advocates allowing a class to handle only a set of related things. By controlling its direction of change, it will be better to maintain later. If there are many factors that cause change, the class will carry on a large amount of responsibilities. And it increases the difficulty of maintaining a class. The common God classes are like this.**

![]({{ site.url }}{{ site.img_path }}{{ '/oo/en/ood-srp.jpg' }})

---

## Introduce middleman as reading ambassadors to liberate himself

After several years of expansion, Yuan’s company has been operating well. He started to think about how to build a culture for his company.

Yuan has always attached great importance to reading and he wanted to organize a reading community in the company - a weekly sharing session. In the beginning, he proposed that the administration department and the human resources department should take responsibility for this.The two departments should take turns, and he communicated with each owner.



Two months passed, and the company’s reading atmosphere had been greatly improved. Bookshelves are spread all over the office. Break time had been shifted from gossip to book reading experience sharing.



Even though he was relieved, Yuan also felt powerless. This phenomenon often occurred: sometimes he would go to Mr. Shi in the human resource department to discuss reading related work, but was told that it was Mr. Zheng’s turn in the administration department. And when he went to Mr. Zheng, he was told that the marketing department was also one of the organizers, and it’s the marketing department’s turn this week.



Yuan was already busy with the company’s operations and the repeated coordination work for the reading campaign further exhausted him. However, he highly valued the reading community. After much pondering, he decided to recruit a reading ambassador (he can be a little bit extravagant when he is rich). Before starting the reading session each week, he directly communicated with the ambassador, and the ambassador then coordinated with the corresponding department to carry out the activity.



Yuan was liberated after this adjustment. He no longer needed to worry about which department will organize the campaign this week or which department will partake next week.



As the reading session blossomed in the company, Yuan thought that he would give a 12-month bonus to the one who read the most and shared the most in the year...



***[Interpretation of OCP]***

**At the beginning, Yuan only supported a reading session held by a certain department. Whenever a new department takes the responsibility to hold the session(like functional expansion), Yuan must change his communication method. That means he supported new requirements by modifying himself. At this time, Yuan is open to modification. The introduction of a reading ambassador is equivalent to making an abstract. Yuan only needs to rely on this abstraction. When a new department holds a reading session, he does not need to change the communication method. At this time, Yuan is closed to modifications, but open to extensions.**


**In software design, OCP advocates closing to modifications, but opening to extensions. It is recommended to provide your service caller with an abstract, high-level behavior interface. Later, when your service has a new kind, all you need to do is add a specific service that implements the abstract, high-level interface without modifying the way how caller uses.**

![]({{ site.url }}{{ site.img_path }}{{ '/oo/en/ood-ocp.jpg' }})

---

## Review the startup story

It can be seen from the story of Yuan that there are two main reasons why Yuan faced various pain points at different stages:

- Paying attention to too many things
- Focusing on the details of things

At the beginning of the startup, what Yuan did was not a big problem. With the company constantly growing (as the software evolves), Yuan needed to figure out new solutions, and the core concepts of these solutions are nothing more than two:

- Separation of concerns(SOC)
- Introduce a middleman



In Object-Oriented design, separation of concerns reflects the essence of software design: high cohesion and low decomposition.The introduction of a middleman is similar to abstract-oriented programming.

---

## In the end

The SOLID principle is actually helping us to design high cohesion and low coupling software which can reduce the maintenance cost of the software. Although the principle can't effectively guide the coding at all times, understanding the design concepts behind these principles is the first step. From then on, you will need to continue to code and practice, reflect on these principles and finally internalize them.



Finally, I want to share a key term with the technical staff – user perspective / business perspective:



We have learned many kinds of techniques(design principles, design patterns, refactoring techniques, etc.).  However, if we forget the original intention and deviate from our goal,  our code may not bring much value no matter how cool and robust it is. We should start from the business need and look at the problem from the user's perspective, then start writing simple and usable code.


---

## Appreciation
This article is originally written in [Chinese](https://sjyuan.club/solid-in-depth-explanation/). Thanks to the translation team, the English edition is published now.

#### Translators' recommendation


***Yangjie Lu*** from ThoughtWorks China Chengdu Office:

> Thanks Shenjian for inviting me write this translator sequence and working with us to translate this blog.《SOLID entrepreneurial story of Mr. Object-Oriented》uses an interesting way to explain what is SOLID principles. It’s easy to understand and impressive, I think it doesn’t only suit for developers, also suits for trainers who are trying to explain the abstract SOLID principles in the form of a story. Recently, I’m working on a team, we have people from five countries, I want to share this blog with them, so I think it’s time to work with our author Shenjian to translate it. Also hope this can share with more people and help more people to understand what is SOLID.



***Ruolin Liang*** from ThoughtWorks China Shenzhen Office:

> As a new TWer, I really want to do something  to help. So when I saw the email asking for volunteers to help to translate this article, I responded with a big YES immediately. It was tough for a non-native English speaker to translate an article into English, but we made it! Thanks to my partners helping me with proofreading and something else.
>
>When I tried to translate this article, I was forced to learn SOLID again. SRP, OCP, LSP… At the time I translated them from Chinese to English, those principles were from blur to clear. It's a good way to learn, and you could try this method next time. I remembered a 13-year-old TensorFlow programmer at the latest GDG DevFest said: "When you want to do something, just do it. And don't be afraid of the difficulties." The same words to you.  And I hope the concepts introduced in this article could be a handy tool for you to make things happen.



We also greatly appreciate them who has provided much support:

- ***Yuan Liu***, from ThoughtWorks China Xi'an Office
- ***Zhang Xin***, from ThoughtWorks China Chengdu office
- ***Kelvin Yong***, from ThoughtWorks Singapore office
- ***Sergey Bukahrov***, from ThoughtWorks Singapore office
- ***Natalie Chin***, from ThoughtWorks Singapore office












