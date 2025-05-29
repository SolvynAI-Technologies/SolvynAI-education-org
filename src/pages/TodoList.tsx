
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckSquare, Plus, Trash2, Calendar, Flag, Layout, MoreHorizontal, User } from 'lucide-react';
import { useTasks, Task } from '@/hooks/useTasks';

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const TodoList = () => {
  const { tasks, loading, error, addTask, updateTask, deleteTask, toggleTask } = useTasks();
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [activeColumn, setActiveColumn] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = async () => {
    if (newTask.trim()) {
      await addTask({
        title: newTask.trim(),
        priority: 'medium',
        status: 'todo',
        description: ''
      });
      setNewTask('');
    }
  };

  const handleKanbanAddTask = async (columnId: string) => {
    if (newTaskTitle.trim()) {
      await addTask({
        title: newTaskTitle.trim(),
        priority: 'medium',
        status: columnId as 'todo' | 'in-progress' | 'review' | 'done',
        description: ''
      });
      
      setNewTaskTitle('');
      setActiveColumn(null);
    }
  };

  const handleToggleTask = async (id: string) => {
    await toggleTask(id);
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask(id);
    }
  };

  const moveTask = async (taskId: string, newStatus: string) => {
    await updateTask(taskId, { status: newStatus as 'todo' | 'in-progress' | 'review' | 'done' });
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return task.status !== 'done';
    if (filter === 'completed') return task.status === 'done';
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getColumnColor = (columnId: string) => {
    switch (columnId) {
      case 'todo': return 'border-t-4 border-t-blue-500';
      case 'in-progress': return 'border-t-4 border-t-yellow-500';
      case 'review': return 'border-t-4 border-t-purple-500';
      case 'done': return 'border-t-4 border-t-green-500';
      default: return 'border-t-4 border-t-gray-500';
    }
  };

  const columns: Column[] = [
    {
      id: 'todo',
      title: 'To Do',
      tasks: tasks.filter(task => task.status === 'todo')
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: tasks.filter(task => task.status === 'in-progress')
    },
    {
      id: 'review',
      title: 'Review',
      tasks: tasks.filter(task => task.status === 'review')
    },
    {
      id: 'done',
      title: 'Done',
      tasks: tasks.filter(task => task.status === 'done')
    }
  ];

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-800 dark:text-red-200">Error</CardTitle>
            <CardDescription className="text-red-700 dark:text-red-300">
              {error}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-orange-500 to-pink-600 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <CheckSquare className="h-6 w-6" />
            <span>Task Manager</span>
          </CardTitle>
          <CardDescription className="text-orange-100">
            Organize your tasks and boost your productivity with list and kanban views
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list" className="flex items-center space-x-2">
            <CheckSquare className="h-4 w-4" />
            <span>List View</span>
          </TabsTrigger>
          <TabsTrigger value="kanban" className="flex items-center space-x-2">
            <Layout className="h-4 w-4" />
            <span>Kanban Board</span>
          </TabsTrigger>
        </TabsList>

        {/* List View */}
        <TabsContent value="list" className="space-y-6">
          {/* Add Task */}
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Add New Task</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Input
                  placeholder="What needs to be done?"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                  className="flex-1 bg-gray-50 dark:bg-gray-700"
                />
                <Button onClick={handleAddTask} className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Filter and Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {tasks.length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {tasks.filter(t => t.status === 'done').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {tasks.filter(t => t.status !== 'done').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
              <CardContent className="pt-6">
                <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                  <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tasks</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Tasks List */}
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white">Tasks</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Manage your daily tasks and stay organized
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredTasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tasks found. Add a new task to get started!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-200 ${
                        task.status === 'done'
                          ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 opacity-75' 
                          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:shadow-md'
                      }`}
                    >
                      <Checkbox
                        checked={task.status === 'done'}
                        onCheckedChange={() => handleToggleTask(task.id)}
                        className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium ${
                          task.status === 'done'
                            ? 'line-through text-gray-500 dark:text-gray-400' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {task.title}
                        </div>
                        
                        <div className="flex items-center space-x-3 mt-1">
                          <Badge className={getPriorityColor(task.priority)}>
                            <Flag className="h-3 w-3 mr-1" />
                            {task.priority}
                          </Badge>
                          
                          <Badge variant="outline" className="text-xs">
                            {task.status}
                          </Badge>
                          
                          {task.due_date && (
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(task.due_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Kanban View */}
        <TabsContent value="kanban" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {columns.map((column) => (
              <Card key={column.id} className={`bg-white dark:bg-gray-800 border-0 shadow-sm ${getColumnColor(column.id)}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-gray-900 dark:text-white">
                      {column.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {column.tasks.length}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setActiveColumn(column.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {activeColumn === column.id && (
                    <div className="space-y-2">
                      <Input
                        placeholder="Enter task title"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleKanbanAddTask(column.id)}
                        className="bg-gray-50 dark:bg-gray-700 text-sm"
                      />
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleKanbanAddTask(column.id)}
                          className="flex-1"
                        >
                          Add
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setActiveColumn(null)}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {column.tasks.map((task) => (
                    <Card key={task.id} className="border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm text-gray-900 dark:text-white leading-tight">
                              {task.title}
                            </h4>
                            <div className="relative">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-5 w-5 p-0"
                                onClick={() => handleDeleteTask(task.id)}
                              >
                                <Trash2 className="h-3 w-3 text-red-500" />
                              </Button>
                            </div>
                          </div>
                          
                          {task.description && (
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                              {task.priority}
                            </Badge>
                            
                            {task.due_date && (
                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <Calendar className="h-3 w-3 mr-1" />
                                {new Date(task.due_date).toLocaleDateString()}
                              </div>
                            )}
                          </div>

                          <div className="flex space-x-1 pt-2">
                            {column.id !== 'todo' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const newStatus = column.id === 'in-progress' ? 'todo' : 
                                                 column.id === 'review' ? 'in-progress' : 'review';
                                  moveTask(task.id, newStatus);
                                }}
                                className="text-xs px-2 py-1 h-6"
                              >
                                ←
                              </Button>
                            )}
                            {column.id !== 'done' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const newStatus = column.id === 'todo' ? 'in-progress' : 
                                                 column.id === 'in-progress' ? 'review' : 'done';
                                  moveTask(task.id, newStatus);
                                }}
                                className="text-xs px-2 py-1 h-6"
                              >
                                →
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {activeColumn !== column.id && (
                    <Button
                      variant="ghost"
                      onClick={() => setActiveColumn(column.id)}
                      className="w-full justify-start text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add a task
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TodoList;
