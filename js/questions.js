// PMP Questions Database
const questionBank = [
    // People Domain Questions
    {
        id: 1,
        domain: "People",
        subdomain: "Team Management",
        question: "A project manager is leading a cross-functional team where two key members have conflicting opinions about the technical approach. This conflict is affecting team morale and project progress. What should the project manager do FIRST?",
        options: [
            "Escalate the issue to the sponsor for resolution",
            "Meet with both team members individually to understand their perspectives",
            "Make a decision based on the project requirements and inform the team",
            "Replace one of the conflicting team members"
        ],
        correct: 1,
        explanation: "The project manager should first understand both perspectives through individual meetings. This approach helps gather information, shows respect for both parties, and allows for finding a collaborative solution."
    },
    {
        id: 2,
        domain: "People",
        subdomain: "Leadership",
        question: "During a sprint retrospective, the team identifies that they are consistently unable to complete all planned work. The team members seem demotivated. What leadership style should the project manager adopt?",
        options: [
            "Directive leadership to ensure tasks are completed",
            "Laissez-faire to let the team self-organize",
            "Servant leadership to support and empower the team",
            "Transactional leadership with rewards for completion"
        ],
        correct: 2,
        explanation: "Servant leadership is most appropriate here as it focuses on supporting and empowering the team, removing obstacles, and helping them succeed, which addresses both the completion issues and motivation."
    },
    {
        id: 3,
        domain: "People",
        subdomain: "Communication",
        question: "A stakeholder complains that they are not receiving adequate project updates despite being on the distribution list for all project communications. What should the project manager do?",
        options: [
            "Add more detail to the existing reports",
            "Review and update the stakeholder engagement plan",
            "Send duplicate emails to ensure receipt",
            "Ask the stakeholder to check their spam folder"
        ],
        correct: 1,
        explanation: "Reviewing and updating the stakeholder engagement plan helps identify the stakeholder's specific communication needs and preferences, ensuring effective communication."
    },
    
    // Process Domain Questions
    {
        id: 4,
        domain: "Process",
        subdomain: "Planning",
        question: "A project manager is planning a complex software development project with unclear requirements. Which approach would be MOST appropriate for planning this project?",
        options: [
            "Create a detailed project plan with fixed milestones",
            "Use rolling wave planning with iterative elaboration",
            "Wait until all requirements are clear before planning",
            "Copy the plan from a similar previous project"
        ],
        correct: 1,
        explanation: "Rolling wave planning with iterative elaboration is ideal for projects with unclear requirements, allowing for detailed planning of near-term work while keeping future work at a higher level."
    },
    {
        id: 5,
        domain: "Process",
        subdomain: "Risk Management",
        question: "During risk identification, a team member mentions a risk that has a very low probability but would have catastrophic impact if it occurs. How should this risk be handled?",
        options: [
            "Ignore it due to low probability",
            "Include it in the risk register and develop a contingency plan",
            "Immediately escalate to senior management",
            "Transfer the entire project to another team"
        ],
        correct: 1,
        explanation: "All identified risks should be documented in the risk register. High-impact risks, even with low probability, require contingency planning due to their potential catastrophic effects."
    },
    {
        id: 6,
        domain: "Process",
        subdomain: "Quality",
        question: "A project deliverable fails quality inspection. The team suggests implementing a quick fix to meet the deadline. What should the project manager prioritize?",
        options: [
            "Implement the quick fix to meet the deadline",
            "Perform root cause analysis before deciding on action",
            "Extend the deadline unilaterally",
            "Deliver the product as-is with a disclaimer"
        ],
        correct: 1,
        explanation: "Root cause analysis should be performed to understand why the quality issue occurred and to implement a proper solution that prevents recurrence, rather than applying a quick fix."
    },
    
    // Business Environment Domain Questions
    {
        id: 7,
        domain: "Business Environment",
        subdomain: "Value Delivery",
        question: "A project has delivered all planned features on time and within budget, but the customer satisfaction survey shows poor results. What should the project manager focus on?",
        options: [
            "Document lessons learned for future projects",
            "Analyze whether the project delivered the expected business value",
            "Celebrate the successful on-time and on-budget delivery",
            "Blame the customer for unclear requirements"
        ],
        correct: 1,
        explanation: "Even if a project meets time and budget constraints, it must deliver business value and meet customer expectations. Analysis of value delivery is crucial for project success."
    },
    {
        id: 8,
        domain: "Business Environment",
        subdomain: "Compliance",
        question: "During project execution, new regulatory requirements are announced that will affect the project deliverables. What is the FIRST thing the project manager should do?",
        options: [
            "Submit a change request immediately",
            "Assess the impact on project scope, time, and cost",
            "Inform the team to incorporate the changes",
            "Request additional budget from the sponsor"
        ],
        correct: 1,
        explanation: "The first step is to assess the impact of the new regulatory requirements on all project constraints before taking any action or making recommendations."
    },
    {
        id: 9,
        domain: "Business Environment",
        subdomain: "Stakeholder Management",
        question: "A key stakeholder who was supportive at project initiation has become resistant to the project. What should the project manager do?",
        options: [
            "Continue with the project as planned",
            "Escalate to the project sponsor",
            "Engage with the stakeholder to understand their concerns",
            "Remove the stakeholder from communications"
        ],
        correct: 2,
        explanation: "Engaging directly with the stakeholder to understand their concerns and address them is the best approach to managing stakeholder resistance."
    },
    
    // Agile/Hybrid Questions
    {
        id: 10,
        domain: "Agile",
        subdomain: "Agile Principles",
        question: "An agile team is struggling with changing requirements every sprint. Stakeholders are frustrated with the lack of predictability. What should the project manager recommend?",
        options: [
            "Switch to a waterfall approach for better predictability",
            "Lock requirements at the beginning of each release",
            "Educate stakeholders on agile principles and establish a product backlog refinement process",
            "Refuse any requirement changes after sprint planning"
        ],
        correct: 2,
        explanation: "Educating stakeholders on agile principles and establishing proper backlog refinement helps manage expectations while maintaining agility."
    },
    {
        id: 11,
        domain: "Agile",
        subdomain: "Scrum Framework",
        question: "During a sprint, a critical production issue arises that requires immediate attention from the development team. What should the Scrum Master do?",
        options: [
            "Add the issue to the current sprint backlog",
            "Wait until the next sprint to address it",
            "Work with the Product Owner to adjust the sprint scope",
            "Tell the team to work overtime to handle both"
        ],
        correct: 2,
        explanation: "The Scrum Master should work with the Product Owner to adjust sprint scope, potentially removing lower-priority items to accommodate the critical issue."
    },
    {
        id: 12,
        domain: "Hybrid",
        subdomain: "Approach Selection",
        question: "A project has fixed regulatory requirements but needs flexibility in user interface design. Which approach would be MOST suitable?",
        options: [
            "Pure waterfall for the entire project",
            "Pure agile for the entire project",
            "Hybrid approach with waterfall for regulatory requirements and agile for UI",
            "Let each team member choose their preferred approach"
        ],
        correct: 2,
        explanation: "A hybrid approach allows using waterfall for fixed regulatory requirements while applying agile for areas needing flexibility like UI design."
    },
    
    // More comprehensive questions
    {
        id: 13,
        domain: "People",
        subdomain: "Team Development",
        question: "A newly formed project team is experiencing confusion about roles and responsibilities. According to Tuckman's model, what stage is the team in?",
        options: [
            "Forming",
            "Storming",
            "Norming",
            "Performing"
        ],
        correct: 0,
        explanation: "The team is in the Forming stage, characterized by confusion about roles, responsibilities, and team purpose. This is typical for newly formed teams."
    },
    {
        id: 14,
        domain: "Process",
        subdomain: "Schedule Management",
        question: "A project activity on the critical path is delayed by 5 days. What is the impact on the project?",
        options: [
            "No impact if there is total float",
            "The project will be delayed by 5 days",
            "Only the specific activity is affected",
            "Impact depends on free float"
        ],
        correct: 1,
        explanation: "Activities on the critical path have zero float, so any delay directly impacts the project end date by the same duration."
    },
    {
        id: 15,
        domain: "Business Environment",
        subdomain: "Benefits Realization",
        question: "When should benefits realization be planned in a project?",
        options: [
            "After project closure",
            "During project execution",
            "During project initiation and planning",
            "When requested by stakeholders"
        ],
        correct: 2,
        explanation: "Benefits realization should be planned during project initiation and planning phases to ensure the project is aligned with expected business benefits from the start."
    },
    {
        id: 16,
        domain: "People",
        subdomain: "Conflict Resolution",
        question: "Two team members have a technical disagreement that is escalating. The project manager uses a compromise approach. What is the likely outcome?",
        options: [
            "Both parties fully satisfied",
            "One party wins, one loses",
            "Both parties partially satisfied",
            "The conflict remains unresolved"
        ],
        correct: 2,
        explanation: "Compromise results in both parties being partially satisfied as each gives up something to reach a middle ground solution."
    },
    {
        id: 17,
        domain: "Process",
        subdomain: "Cost Management",
        question: "A project has a CPI of 0.85 and an SPI of 1.1. What does this indicate?",
        options: [
            "Project is over budget and behind schedule",
            "Project is under budget and ahead of schedule",
            "Project is over budget but ahead of schedule",
            "Project is under budget but behind schedule"
        ],
        correct: 2,
        explanation: "CPI < 1 indicates over budget, while SPI > 1 indicates ahead of schedule. The project is spending more than planned but completing work faster than planned."
    },
    {
        id: 18,
        domain: "Agile",
        subdomain: "Velocity",
        question: "An agile team's velocity has been decreasing over the last three sprints. What should be investigated FIRST?",
        options: [
            "Team member performance issues",
            "Impediments and technical debt",
            "Story point estimation accuracy",
            "Product Owner involvement"
        ],
        correct: 1,
        explanation: "Decreasing velocity often indicates impediments or accumulating technical debt that slows the team down. These should be investigated first."
    },
    {
        id: 19,
        domain: "People",
        subdomain: "Motivation",
        question: "According to Herzberg's theory, which of the following is a hygiene factor?",
        options: [
            "Achievement",
            "Recognition",
            "Salary",
            "Responsibility"
        ],
        correct: 2,
        explanation: "Salary is a hygiene factor in Herzberg's theory. Hygiene factors don't motivate but their absence causes dissatisfaction."
    },
    {
        id: 20,
        domain: "Process",
        subdomain: "Procurement",
        question: "A vendor has delivered equipment that doesn't meet specifications. What document should be referenced FIRST?",
        options: [
            "Statement of Work (SOW)",
            "Request for Proposal (RFP)",
            "Procurement Management Plan",
            "Contract/Agreement"
        ],
        correct: 3,
        explanation: "The contract/agreement contains the legally binding specifications and terms that the vendor must meet, making it the primary reference for non-conformance issues."
    }
];

// Function to get questions by domain
function getQuestionsByDomain(domain) {
    return questionBank.filter(q => q.domain === domain);
}

// Function to get random questions
function getRandomQuestions(count) {
    const shuffled = [...questionBank].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Function to get questions for full exam (180 questions)
function getFullExamQuestions() {
    // PMP exam distribution (approximate)
    // People: 42% (75 questions)
    // Process: 50% (90 questions)  
    // Business Environment: 8% (15 questions)
    
    const fullExam = [];
    const peopleQuestions = getQuestionsByDomain("People");
    const processQuestions = getQuestionsByDomain("Process");
    const businessQuestions = getQuestionsByDomain("Business Environment");
    const agileQuestions = getQuestionsByDomain("Agile");
    const hybridQuestions = getQuestionsByDomain("Hybrid");
    
    // For demo purposes, we'll cycle through available questions
    // In production, you'd have 180+ unique questions
    
    // Add questions based on distribution
    for (let i = 0; i < 180; i++) {
        if (i < 75) {
            // People domain (42%)
            fullExam.push({...peopleQuestions[i % peopleQuestions.length], examIndex: i + 1});
        } else if (i < 165) {
            // Process domain (50%)
            fullExam.push({...processQuestions[i % processQuestions.length], examIndex: i + 1});
        } else {
            // Business Environment (8%)
            fullExam.push({...businessQuestions[i % businessQuestions.length], examIndex: i + 1});
        }
    }
    
    // Shuffle the questions
    return fullExam.sort(() => 0.5 - Math.random());
}

// Function to get questions for quick test (20 questions)
function getQuickTestQuestions() {
    return getRandomQuestions(20);
}

// Function to get questions by topic
function getTopicQuestions(topic, count = 10) {
    const topicQuestions = questionBank.filter(q => 
        q.domain === topic || q.subdomain === topic
    );
    return topicQuestions.slice(0, Math.min(count, topicQuestions.length));
}

// Export for use in other scripts
window.questionBank = questionBank;
window.questionFunctions = {
    getQuestionsByDomain,
    getRandomQuestions,
    getFullExamQuestions,
    getQuickTestQuestions,
    getTopicQuestions
};
