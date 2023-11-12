function Task(id, description, cost) {
    const id = Math.random().toString(16).slice(2);
    const _description = description;
    const _cost = cost;
    if (cost < 0) {
      throw new Error("Cost must be >= 0");
    }
    if (new.target === Task) {
      throw new Error("You cannot create an instance of the Task class!");
    }
  
    Object.defineProperties(this, {
      id: {
        get() {
          return id;
        },
      },
      description: {
        get() {
          return _description;
        },
      },
      cost: {
        get() {
          return _cost;
        },
      },
    });
  }
  
  class IncomeTask extends Task {
    makeDone(budget) {
      budget.income += this.cost;
    }
    makeUnDone(budget) {
      budget.income -= this.cost;
    }
  }
  
  class ExpenseTask extends Task {
    makeDone(budget) {
      budget.exspenses += this.cost;
    }
    makeUnDone(budget) {
      budget.exspenses -= this.cost;
    }
  }
  
  class TasksController {
    #tasks;
    constructor() {
      this.#tasks = [];
    }
  
    addTasks(...tasks) {
      for (const task of tasks) {
        if (!this.#tasks.find((existingTask) => existingTask.id === task.id)) {
          this.#tasks.push(task);
        }
      }
    }
  
    deleteTask(task) {
      const index = this.#tasks.findIndex(function (existingTask) {
        return existingTask.id === task.id;
      });
  
      if (index === -1) {
        console.log(`Task ${task.id} isn't recognized`);
        return;
      }
  
      this.#tasks.splice(index, 1);
    }
  
    getTasks() {
      return this.#tasks;
    }
  
    getTasksSortedBy(sortBy) {
      let sortedTasks = [...this.#tasks];
      switch (sortBy) {
        case "description":
          sortedTasks.sort(function (a, b) {
            return a.description.localeCompare(b.description);
          });
          break;
  
        case "cost":
          sortedTasks.sort(function (a, b) {
            return b.cost - a.cost;
          });
          break;
        default:
          console.log("Invalid sortBy value");
      }
      return sortedTasks;
    }
  
    getFilteredTasks(filter) {
      return this.#tasks.filter(function (task) {
        if (filter.isCompleted !== undefined) {
          if (filter.isCompleted && !task.isCompleted) {
            return false;
          }
          if (!filter.isCompleted && task.isCompleted) {
            return false;
          }
        }
        return true;
      });
    }
  }
  
  class BudgetController {
    #tasksController;
    #budget;
  
    constructor(balance = 0) {
      this.#tasksController = new TasksController();
      this.#budget = {
        balance: balance,
        income: 0,
        expenses: 0,
      };
    }
  
    get balance() {
      return this.#budget.balance;
    }
  
    get income() {
      return this.#budget.income;
    }
  
    get expenses() {
      return this.#budget.expenses;
    }
  
    calculateBalance() {
      return this.balance + this.income - this.expenses;
    }
  
    getTasks() {
      return this.#tasksController.getTasks();
    }
  
    addTasks(...tasks) {
      this.#tasksController.addTasks(...tasks);
    }
  
    deleteTask(task) {
      this.#tasksController.deleteTask(task);
      if (task.isCompleted) {
        task.makeUnDone(this.#budget);
      }
    }
  
    doneTask(task) {
      if (task.isCompleted) {
        console.log("Task is already done");
        return;
      }
      task.makeDone(this.#budget);
    }
  
    unDoneTask(task) {
      if (!task.isCompleted) {
        console.log("Task isn't done before");
        return;
      }
      task.makeUnDone(this.#budget);
    }
  }
  