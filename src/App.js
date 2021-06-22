import { useState, useEffect } from 'react';
import Header from "./components/Header";
// import Footer from "./components/Footer";
import Tasks from './components/Tasks';
import AddTask from './components/AddTask';
// import About from './components/About';





const App = () => {

  const[showAddTask, setShowAddTask] = useState(false)

  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
      const taskFromServer = await fetchTasks()
      setTasks(taskFromServer)
    }
    
    getTasks()
  }, [])


  // Fetch task
  const fetchTasks = async() => {
    const res = await fetch('http://localhost:5000/tasks')
  const data = await res.json()

    return data
  }


//Add task to the mocked Data base 'POST METHOD'
  const addTask = async (task) => {
    const res = await fetch(`http://localhost:5000/tasks`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    })
      
    const data = await res.json();
    
    setTasks([...tasks, data])

    // const id = Math.floor(Math.random() * 10000) + 1
    // const newTask = { id, ...task }
    // setTasks([...tasks, newTask])

  }


    // Update task
    const fetchTask = async(id) => {
      const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()
  
      return data
    }

  
// function to delete task from the mocked Data Bse "Delete method"
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'DELETE'
    })
    setTasks(tasks.filter((task)=> task.id !== id))
  }

  // function to toggle reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id);
    const updateTask = { ...taskToToggle, reminder: !taskToToggle.reminder }
    
    const res = await fetch(`http://localhost:5000/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updateTask)
    })

    const data = await res.json();
      

    setTasks(tasks.map((task) =>
      task.id === id ? {...task, reminder:
          data.reminder} : task
    )
    )
  }

  return (
      <div className="container">
        <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask}/>
        {showAddTask && <AddTask onAdd={addTask}/>}
        {tasks.length > 0 ? (
          <Tasks
            tasks={tasks}
            onDelete={deleteTask}
            onToggle={toggleReminder}
            onAdd={addTask}
            />
          ) : ('No Todo Task available to show')}
        </div>
  );
}

export default App;
