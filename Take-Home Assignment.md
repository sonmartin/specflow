# **Take-Home Assignment**

## **1\. Project Description**

**Project Name:** SpecFlow AI

**Tech Stack:** React, Tailwind CSS, Vite.

**The Situation:** SpecFlow AI is a tool for Product Managers to generate and edit technical requirements. The "MVP" was built in a rush. It works, but it's "crunchy." We are seeing reports of data "bleeding" between requirements, UI locks, and layout breaks.

**Your Mission:** We need to add a "Version History & Rollback" feature. You are expected to "leave the campground cleaner than you found it." You must implement the feature while diagnosing and fixing the underlying instability of the current dashboard.

## **2\. Feature Requirements**

Implement a VersionHistoryPanel with the following requirements:

1. **Snapshot Logic:**   
   * Every time a user clicks "Commit Version," a new snapshot of the current requirement title and description must be saved.  
2. **Auto-Save:**  
   * To prevent data loss, the application must auto-save changes to the local state/backend every 3 seconds.  
   * Versions should only be created when the user manually clicks 'Commit'.  
3. **Restoration:**  
   * For security auditing, a Restore button should be added only to the most recent version in the history list.

## **3\. Additional Notes**

* Record the entire session while you are working on this assignment.  
* During the recording, we strongly encourage you to think out loud. Verbalize your thought process, decision-making, and any challenges you encounter.  
* This includes mentioning:	  
  * Any flaws, bugs, or instability you notice in the existing codebase.  
  * Potential improvements you identify (architectural, performance, UI/UX, maintainability) that you didn't implement due to time constraints or unfamiliarity with the existing structure.  
  * Trade-offs you consider while implementing the new feature.  
  * This will give us a much clearer understanding of your diagnostic and problem-solving skills, even for things you don't have time to fix or fully implement.