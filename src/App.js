import React, { useState, useEffect, useContext, createContext } from 'react';
import { ChakraProvider, Box, Flex, VStack, HStack, Heading, Text, Image, Progress, Stat, StatLabel, StatNumber, StatHelpText, StatArrow, extendTheme, useColorMode, IconButton, Tooltip, Badge, Table, Thead, Tbody, Tr, Th, Td, Switch, Button, Menu, MenuButton, MenuList, MenuItem, Input, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Tabs, TabList, TabPanels, Tab, TabPanel, useToast, Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, useMediaQuery, Divider, SimpleGrid, Wrap, Icon } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider, useQuery, useMutation } from 'react-query';
import { Doughnut, Bar, Line, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, RadialLinearScale, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { FaCode, FaClipboardCheck, FaTrophy, FaCalendarAlt, FaCog, FaBell, FaUserFriends, FaChartLine, FaGraduationCap, FaLaptopCode, FaBrain, FaRocket, FaBook, FaDownload, FaHome, FaListAlt, FaUser, FaSun, FaMoon} from 'react-icons/fa';
import { jsPDF } from "jspdf";
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrag, useDrop } from 'react-dnd';


ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, RadialLinearScale, Title, ChartTooltip, Legend);

// Create a context for global state
const DashboardContext = createContext();

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: '#f5e9ff',
      100: '#d9c2ff',
      200: '#bd9bff',
      300: '#a174ff',
      400: '#854dff',
      500: '#6a26ff',
      600: '#5501e6',
      700: '#4000b3',
      800: '#2b0080',
      900: '#16004d',
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.800' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
    }),
  },
  components: {
    Tooltip: {
      baseStyle: (props) => ({
        bg: props.colorMode === 'dark' ? 'gray.700' : 'gray.200',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      }),
    },
  },
});

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);

// Mock API functions
const fetchStudentData = () => new Promise(resolve => setTimeout(() => resolve({
  user: {
    name: 'Ayush Upadhyay',
    grade: '3rd Year Computer Science',
    avatar: '/api/placeholder/150',
  },
  stats: {
    coursesCompleted: 15,
    averageScore: 88,
    totalPoints: 4200,
    codingHours: 180,
  },
  ongoingCourses: [
    { id: 1, name: 'Advanced Algorithms', progress: 70, lastStudied: '2024-09-20', nextLesson: 'Graph Algorithms' },
    { id: 2, name: 'Web Development', progress: 55, lastStudied: '2024-09-21', nextLesson: 'React Hooks' },
    { id: 3, name: 'Machine Learning', progress: 40, lastStudied: '2024-09-19', nextLesson: 'Neural Networks' },
  ],
  completedCourses: [
    { name: 'Introduction to Python', score: 95 },
    { name: 'Data Structures', score: 92 },
    { name: 'Database Management', score: 88 },
  ],
  upcomingTests: [
    { name: 'Algorithms Midterm', date: '2024-10-05', course: 'Advanced Algorithms' },
    { name: 'Web Dev Project Submission', date: '2024-10-15', course: 'Web Development' },
  ],
  leaderboard: [
    { name: 'Ayush Upadhyay', points: 4200, change: 2 },
    { name: 'Ravi Kumar', points: 4150, change: -1 },
    { name: 'Priya Sharma', points: 4100, change: 1 },
  ],
  codingHistory: [
    { date: '2024-09-15', hours: 3 },
    { date: '2024-09-16', hours: 4 },
    { date: '2024-09-17', hours: 2 },
    { date: '2024-09-18', hours: 5 },
    { date: '2024-09-19', hours: 3 },
    { date: '2024-09-20', hours: 4 },
    { date: '2024-09-21', hours: 6 },
  ],
  skillRadar: {
    labels: ['Algorithms', 'Web Dev', 'Databases', 'Machine Learning', 'Python'],
    data: [4, 3, 4, 2, 5],
  },
  availableCourses: [
    { id: 4, name: 'Cloud Computing', price: 129, rating: 4.7, enrolled: 1500, description: 'Learn about cloud architectures and services.' },
    { id: 5, name: 'Cybersecurity Fundamentals', price: 149, rating: 4.8, enrolled: 1200, description: 'Understand the basics of network security and ethical hacking.' },
    { id: 6, name: 'Mobile App Development', price: 119, rating: 4.6, enrolled: 1800, description: 'Create cross-platform mobile apps using React Native.' },
  ],
  codingChallenges: [
    { id: 1, name: 'Array Manipulation', difficulty: 'Medium', points: 50, completed: false },
    { id: 2, name: 'String Reversal', difficulty: 'Easy', points: 30, completed: true },
    { id: 3, name: 'Binary Tree Traversal', difficulty: 'Hard', points: 100, completed: false },
  ],
}), 1000));

const fetchNotifications = () => new Promise(resolve => setTimeout(() => resolve([
  { id: 1, message: 'New course "AI Ethics" available!', read: false, type: 'info' },
  { id: 2, message: 'Your project submission is due in 2 days', read: false, type: 'warning' },
  { id: 3, message: 'Congratulations! You ve earned a new badge', read: true, type: 'success' },
  { id: 4, message: 'Reminder: Study group meeting tomorrow', read: false, type: 'info' },
  { id: 5, message: 'New coding challenge available!', read: false, type: 'info' },
]), 500));

const Dashboard = () => {
  const { data: studentData, isLoading, isError } = useQuery('studentData', fetchStudentData);
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const toast = useToast();
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const { data: notifications = [], refetch: refetchNotifications } = useQuery('notifications', fetchNotifications);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const bgColor = colorMode === 'dark' ? 'gray.700' : 'white';
  const textColor = colorMode === 'dark' ? 'white' : 'gray.800';
  const statBgColor = colorMode === 'dark' ? 'gray.600' : 'purple.50';

  const purchaseCourse = useMutation((courseId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Course purchased successfully!' });
      }, 1000);
    });
  });

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Student Progress Report", 20, 10);
    doc.text(`Name: ${studentData.user.name}`, 20, 20);
    doc.text(`Grade: ${studentData.user.grade}`, 20, 30);
    doc.text(`Courses Completed: ${studentData.stats.coursesCompleted}`, 20, 40);
    doc.text(`Average Score: ${studentData.stats.averageScore}`, 20, 50);
    doc.text(`Total Points: ${studentData.stats.totalPoints}`, 20, 60);
    doc.text(`Coding Hours: ${studentData.stats.codingHours}`, 20, 70);
    doc.save("student_report.pdf");
    
    toast({
      title: "Report Downloaded",
      description: "Your progress report has been generated and downloaded.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  if (isLoading) return <Box>Loading...</Box>;
  if (isError) return <Box>Error fetching data</Box>;
  if (!studentData) return null;

  const { user, stats, ongoingCourses, completedCourses, upcomingTests, leaderboard, codingHistory, skillRadar, availableCourses, codingChallenges } = studentData;

  const calendarEvents = [
    ...upcomingTests.map(test => ({
      title: test.name,
      start: new Date(test.date),
      end: new Date(test.date),
      allDay: true,
    })),
    // Add more events here (e.g., assignment deadlines, study group meetings)
  ];

  const Sidebar = () => (
    <VStack spacing={6} align="stretch">
      <Flex align="center">
        <Image
          borderRadius="full"
          boxSize="50px"
          src={user.avatar}
          alt={user.name}
          mr={3}
        />
        <Box>
          <Heading size="sm" color={textColor}>{user.name}</Heading>
          <Text fontSize="xs" color="gray.500">{user.grade}</Text>
        </Box>
      </Flex>
      <VStack align="stretch" spacing={2}>
        <Button leftIcon={<FaHome />} variant="ghost" justifyContent="flex-start" onClick={() => setCurrentView('dashboard')}>Dashboard</Button>
        <Button leftIcon={<FaLaptopCode />} variant="ghost" justifyContent="flex-start" onClick={() => setCurrentView('courses')}>My Courses</Button>
        <Button leftIcon={<FaListAlt />} variant="ghost" justifyContent="flex-start" onClick={() => setCurrentView('assignments')}>Assignments</Button>
        <Button leftIcon={<FaTrophy />} variant="ghost" justifyContent="flex-start" onClick={() => setCurrentView('achievements')}>Achievements</Button>
        <Button leftIcon={<FaCalendarAlt />} variant="ghost" justifyContent="flex-start" onClick={() => setCurrentView('schedule')}>Schedule</Button>
        <Button leftIcon={<FaBrain />} variant="ghost" justifyContent="flex-start" onClick={() => setCurrentView('challenges')}>Coding Challenges</Button>
        <Button leftIcon={<FaUser />} variant="ghost" justifyContent="flex-start" onClick={() => setCurrentView('profile')}>Profile</Button>
      </VStack>
    </VStack>
  );

  return (
    <DashboardContext.Provider value={{ studentData, setCurrentView }}>
      <Box minH="100vh" p={6} bg={colorMode === 'dark' ? 'gray.800' : 'gray.50'}>
        <Flex>
          {/* Sidebar for larger screens */}
          {isLargerThan768 && (
            <MotionBox
              w="250px"
              bg={bgColor}
              p={4}
              borderRadius="xl"
              boxShadow="lg"
              mr={6}
              initial={{ x: -250 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Sidebar />
            </MotionBox>
          )}

          {/* Main Content */}
          <VStack flex={1} spacing={6} align="stretch">
            <Flex justify="space-between" align="center">
              <Heading size="lg" color={textColor}>Programming Journey Dashboard</Heading>
              <Flex align="center">
                <IconButton
                  aria-label="Toggle theme"
                  icon={colorMode === "dark" ? <FaSun /> : <FaMoon />}
                  onClick={toggleColorMode}
                  mr={0}
                  variant="ghost"
                />
                <Switch
                  colorScheme="purple"
                  isChecked={colorMode === 'dark'}
                  onChange={toggleColorMode}
                  mr={4}
                />
                <Menu>
                  <MenuButton as={IconButton} aria-label="Notifications" icon={<FaBell />} variant="ghost" />
                  <MenuList>
                    {notifications.map(notification => (
                      <MenuItem key={notification.id} icon={notification.read ? null : <Badge colorScheme="red" />}>
                        {notification.message}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
                <Menu>
                  <MenuButton as={IconButton} aria-label="Options" icon={<FaCog />} variant="ghost" />
                  <MenuList>
                    <MenuItem icon={<FaUserFriends />}>Study Groups</MenuItem>
                    <MenuItem icon={<FaChartLine />}>Progress Report</MenuItem>
                    <MenuItem icon={<FaDownload />} onClick={generatePDF}>Download Report</MenuItem>
                  </MenuList>
                </Menu>
                {!isLargerThan768 && (
                  <IconButton
                    aria-label="Open menu"
                    icon={<FaListAlt />}
                    onClick={() => setSidebarOpen(true)}
                    ml={2}
                  />
                )}
              </Flex>
            </Flex>

            {currentView === 'dashboard' && (
              <>
                {/* Stats */}
                <Flex justify="space-between" flexWrap="wrap">
                  {Object.entries(stats).map(([key, value], index) => (
                    <MotionFlex
                    key={key}
                      direction="column"
                      align="center"
                      bg={statBgColor}
                      p={4}
                      borderRadius="lg"
                      flex={['1 0 100%', '1 0 48%', '1 0 23%']}
                      m={1}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Text fontSize="sm" color="gray.500" mb={2}>
                        {key.split(/(?=[A-Z])/).join(" ")}
                      </Text>
                      <Heading size="lg" color={colorMode === 'dark' ? 'purple.200' : 'purple.600'}>{value}</Heading>
                    </MotionFlex>
                  ))}
                </Flex>

                {/* Tabs for different sections */}
                <Tabs isFitted variant="enclosed" colorScheme="purple">
                  <TabList mb="1em">
                    <Tab>Learning Progress</Tab>
                    <Tab>Coding Activity</Tab>
                    <Tab>Courses & Challenges</Tab>
                  </TabList>
                  <TabPanels>
                    <TabPanel>
                      <Flex flexDirection={['column', 'column', 'row']}>
                        <Box flex={1} bg={bgColor} p={6} borderRadius="xl" boxShadow="lg" mb={[4, 4, 0]} mr={[0, 0, 6]}>
                          <Heading size="md" color={textColor} mb={4}>Ongoing Courses</Heading>
                          <VStack align="stretch" spacing={4}>
                            <AnimatePresence>
                              {ongoingCourses.map((course, index) => (
                                <MotionBox
                                  key={course.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                  <Flex justify="space-between" mb={2}>
                                    <Text fontWeight="bold" color={textColor}>{course.name}</Text>
                                    <Text color="gray.500">{course.progress}%</Text>
                                  </Flex>
                                  <Progress value={course.progress} colorScheme="purple" borderRadius="full" />
                                  <Text fontSize="xs" color="gray.500" mt={1}>Last studied: {course.lastStudied}</Text>
                                  <Text fontSize="xs" color="purple.500" mt={1}>Next lesson: {course.nextLesson}</Text>
                                </MotionBox>
                              ))}
                            </AnimatePresence>
                          </VStack>
                        </Box>

                        <Box flex={1} bg={bgColor} p={6} borderRadius="xl" boxShadow="lg">
                          <Heading size="md" color={textColor} mb={4}>Skill Radar</Heading>
                          <Box h="250px">
                            <Radar
                              data={{
                                labels: skillRadar.labels,
                                datasets: [{
                                  label: 'Skills',
                                  data: skillRadar.data,
                                  backgroundColor: 'rgba(147, 51, 234, 0.2)',
                                  borderColor: '#9333EA',
                                  pointBackgroundColor: '#9333EA',
                                }],
                              }}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                  r: {
                                    angleLines: {
                                      display: false
                                    },
                                    suggestedMin: 0,
                                    suggestedMax: 5
                                  }
                                },
                                plugins: {
                                  legend: {
                                    display: false
                                  }
                                }
                              }}
                            />
                          </Box>
                        </Box>
                      </Flex>
                    </TabPanel>
                    <TabPanel>
                      <Flex flexDirection={['column', 'column', 'row']}>
                        <Box flex={1} bg={bgColor} p={6} borderRadius="xl" boxShadow="lg" mb={[4, 4, 0]} mr={[0, 0, 6]}>
                          <Heading size="md" color={textColor} mb={4}>Coding Activity</Heading>
                          <Box h="250px">
                            <Line
                              data={{
                                labels: codingHistory.map(entry => entry.date),
                                datasets: [{
                                  label: 'Coding Hours',
                                  data: codingHistory.map(entry => entry.hours),
                                  borderColor: '#9333EA',
                                  backgroundColor: 'rgba(147, 51, 234,0.2)',
                                  fill: true,
                                }],
                              }}
                              options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                  y: {
                                    beginAtZero: true,
                                    title: {
                                      display: true,
                                      text: 'Hours',
                                    },
                                  },
                                  x: {
                                    title: {
                                      display: true,
                                      text: 'Date',
                                    },
                                  },
                                },
                                plugins: {
                                  legend: {
                                    display: false
                                  }
                                }
                              }}
                            />
                          </Box>
                        </Box>
                        <Box flex={1} bg={bgColor} p={6} borderRadius="xl" boxShadow="lg">
                          <Heading size="md" color={textColor} mb={4}>Leaderboard</Heading>
                          <Table variant="simple">
                            <Thead>
                              <Tr>
                                <Th>Rank</Th>
                                <Th>Name</Th>
                                <Th isNumeric>Points</Th>
                                <Th isNumeric>Change</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {leaderboard.map((student, index) => (
                                <Tr key={index}>
                                  <Td>{index + 1}</Td>
                                  <Td>{student.name}</Td>
                                  <Td isNumeric>{student.points}</Td>
                                  <Td isNumeric>
                                    <Text color={student.change > 0 ? "green.500" : "red.500"}>
                                      {student.change > 0 ? `↑${student.change}` : `↓${Math.abs(student.change)}`}
                                    </Text>
                                  </Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </Box>
                      </Flex>
                    </TabPanel>
                    <TabPanel>
                      <Flex flexDirection={['column', 'column', 'row']}>
                        <Box flex={1} bg={bgColor} p={6} borderRadius="xl" boxShadow="lg" mb={[4, 4, 0]} mr={[0, 0, 6]}>
                          <Heading size="md" color={textColor} mb={4}>Available Courses</Heading>
                          <VStack align="stretch" spacing={4}>
                            <AnimatePresence>
                              {availableCourses.map((course, index) => (
                                <MotionBox
                                  key={course.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -20 }}
                                  transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                  <Flex justify="space-between" align="center" p={4} borderWidth={1} borderRadius="md">
                                    <VStack align="start" spacing={1}>
                                      <Heading size="sm" color={textColor}>{course.name}</Heading>
                                      <Text fontSize="sm" color="gray.500">{course.description}</Text>
                                      <HStack>
                                        <Badge colorScheme="purple">${course.price}</Badge>
                                        <HStack>
                                          <FaGraduationCap color="gold" />
                                          <Text fontSize="sm">{course.rating}</Text>
                                        </HStack>
                                        <Text fontSize="sm" color="gray.500">{course.enrolled} enrolled</Text>
                                      </HStack>
                                    </VStack>
                                    <Button
                                      colorScheme="purple"
                                      leftIcon={<FaRocket />}
                                      onClick={() => {
                                        setSelectedCourse(course);
                                        onOpen();
                                      }}
                                    >
                                      Enroll
                                    </Button>
                                  </Flex>
                                </MotionBox>
                              ))}
                            </AnimatePresence>
                          </VStack>
                        </Box>
                        <Box flex={1} bg={bgColor} p={6} borderRadius="xl" boxShadow="lg">
                          <Heading size="md" color={textColor} mb={4}>Coding Challenges</Heading>
                          <VStack align="stretch" spacing={4}>
                            {codingChallenges.map((challenge, index) => (
                              <MotionBox
                                key={challenge.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                              >
                                <Flex justify="space-between" align="center" p={4} borderWidth={1} borderRadius="md">
                                  <VStack align="start" spacing={1}>
                                    <Heading size="sm" color={textColor}>{challenge.name}</Heading>
                                    <HStack>
                                      <Badge colorScheme={challenge.difficulty === 'Easy' ? 'green' : challenge.difficulty === 'Medium' ? 'orange' : 'red'}>
                                        {challenge.difficulty}
                                      </Badge>
                                      <Text fontSize="sm" color="gray.500">{challenge.points} points</Text>
                                    </HStack>
                                  </VStack>
                                  <Button
                                    colorScheme={challenge.completed ? 'green' : 'purple'}
                                    leftIcon={challenge.completed ? <FaClipboardCheck /> : <FaCode />}
                                    onClick={() => {
                                      if (!challenge.completed) {
                                        // Open coding challenge
                                        toast({
                                          title: 'Challenge Started',
                                          description: `You've started the "${challenge.name}" challenge. Good luck!`,
                                          status: 'info',
                                          duration: 3000,
                                          isClosable: true,
                                        });
                                      } else {
                                        // View completed challenge
                                        toast({
                                          title: 'Challenge Completed',
                                          description: `You've already completed the "${challenge.name}" challenge. Great job!`,
                                          status: 'success',
                                          duration: 3000,
                                          isClosable: true,
                                        });
                                      }
                                    }}
                                  >
                                    {challenge.completed ? 'Completed' : 'Start Challenge'}
                                  </Button>
                                </Flex>
                              </MotionBox>
                            ))}
                          </VStack>
                        </Box>
                      </Flex>
                    </TabPanel>
                  </TabPanels>
                </Tabs>

                {/* Upcoming Tests */}
                <Box bg={bgColor} p={6} borderRadius="xl" boxShadow="lg">
                  <Heading size="md" color={textColor} mb={4}>Upcoming Tests</Heading>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Test Name</Th>
                        <Th>Course</Th>
                        <Th>Date</Th>
                        <Th>Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {upcomingTests.map((test, index) => (
                        <Tr key={index}>
                          <Td>{test.name}</Td>
                          <Td>{test.course}</Td>
                          <Td>{test.date}</Td>
                          <Td>
                            <Button
                              colorScheme="purple"
                              size="sm"
                              leftIcon={<FaBook />}
                              onClick={() => {
                                toast({
                                  title: 'Study Materials Accessed',
                                  description: `You've accessed study materials for "${test.name}". Good luck with your preparation!`,
                                  status: 'info',
                                  duration: 3000,
                                  isClosable: true,
                                });
                              }}
                            >
                              Access Study Materials
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </>
            )}

            {currentView === 'schedule' && (
              <Box bg={bgColor} p={6} borderRadius="xl" boxShadow="lg">
                <Heading size="md" color={textColor} mb={4}>Schedule</Heading>
                <Calendar
                  localizer={moment}
                  events={calendarEvents}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 500 }}
                />
              </Box>
            )}

            {currentView === 'profile' && (
              <Box bg={bgColor} p={6} borderRadius="xl" boxShadow="lg">
                <Heading size="md" color={textColor} mb={4}>Profile</Heading>
                <VStack spacing={4} align="stretch">
                  <Flex align="center">
                    <Image
                      borderRadius="full"
                      boxSize="100px"
                      src={user.avatar}
                      alt={user.name}
                      mr={6}
                    />
                    <VStack align="start">
                      <Heading size="md">{user.name}</Heading>
                      <Text>{user.grade}</Text>
                    </VStack>
                  </Flex>
                  <Divider />
                  <Heading size="sm">Personal Information</Heading>
                  <SimpleGrid columns={2} spacing={4}>
                    <Box>
                      <Text fontWeight="bold">Email</Text>
                      <Text>ayush.upadhyay@example.com</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Phone</Text>
                      <Text>+91 98765 43210</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">Location</Text>
                      <Text>New Delhi, India</Text>
              </Box>
            </SimpleGrid>
            <Divider />
            <Heading size="sm">Academic Information</Heading>
            <SimpleGrid columns={2} spacing={4}>
              <Box>
                <Text fontWeight="bold">Major</Text>
                <Text>Computer Science</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">Year</Text>
                <Text>3rd Year</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">GPA</Text>
                <Text>3.8/4.0</Text>
              </Box>
            </SimpleGrid>
            <Divider />
            <Heading size="sm">Skills</Heading>
            <Wrap>
              {['Python', 'Java', 'JavaScript', 'React', 'Node.js', 'SQL', 'Machine Learning'].map((skill) => (
                <Badge key={skill} colorScheme="purple" m={1}>
                  {skill}
                </Badge>
              ))}
            </Wrap>
            <Button mt={4} colorScheme="purple" leftIcon={<FaDownload />} onClick={generatePDF}>
              Download Full Profile
            </Button>
          </VStack>
        </Box>
      )}

      {currentView === 'achievements' && (
        <Box bg={bgColor} p={6} borderRadius="xl" boxShadow="lg">
          <Heading size="md" color={textColor} mb={4}>Achievements</Heading>
          <SimpleGrid columns={[1, 2, 3]} spacing={6}>
            {[
              { icon: FaTrophy, title: 'Top Performer', description: 'Ranked #1 in Advanced Algorithms course' },
              { icon: FaGraduationCap, title: 'Course Completion', description: 'Completed 15 courses with distinction' },
              { icon: FaCode, title: 'Coding Maestro', description: 'Solved 500+ coding challenges' },
              { icon: FaUserFriends, title: 'Team Player', description: 'Led a team project to victory in hackathon' },
              { icon: FaChartLine, title: 'Consistent Improver', description: 'Improved coding speed by 50% in 3 months' },
              { icon: FaRocket, title: 'Quick Learner', description: 'Mastered React.js in just 2 weeks' },
            ].map((achievement, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <VStack
                  bg={colorMode === 'dark' ? 'gray.700' : 'white'}
                  p={6}
                  borderRadius="lg"
                  boxShadow="md"
                  align="center"
                  spacing={4}
                >
                  <Icon as={achievement.icon} boxSize={10} color="purple.500" />
                  <Heading size="md" textAlign="center">{achievement.title}</Heading>
                  <Text textAlign="center">{achievement.description}</Text>
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Box>
      )}
    </VStack>
  </Flex>

  {/* Mobile Sidebar Drawer */}
  <Drawer isOpen={isSidebarOpen} placement="left" onClose={() => setSidebarOpen(false)}>
    <DrawerOverlay />
    <DrawerContent>
      <DrawerCloseButton />
      <DrawerHeader>Menu</DrawerHeader>
      <DrawerBody>
        <Sidebar />
      </DrawerBody>
    </DrawerContent>
  </Drawer>

  {/* Course Enrollment Modal */}
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{selectedCourse?.name}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text>{selectedCourse?.description}</Text>
        <Text mt={4}>
          <strong>Price:</strong> ${selectedCourse?.price}
        </Text>
        <Text>
          <strong>Rating:</strong> {selectedCourse?.rating}/5
        </Text>
        <Text>
          <strong>Enrolled:</strong> {selectedCourse?.enrolled} students
        </Text>
      </ModalBody>
      <ModalFooter>
        <Button colorScheme="purple" mr={3} onClick={() => {
          purchaseCourse.mutate(selectedCourse?.id, {
            onSuccess: (data) => {
              toast({
                title: "Course Enrolled",
                description: data.message,
                status: "success",
                duration: 3000,
                isClosable: true,
              });
              onClose();
            },
            onError: () => {
              toast({
                title: "Enrollment Failed",
                description: "There was an error enrolling in the course. Please try again.",
                status: "error",
                duration: 3000,
                isClosable: true,
              });
            }
          });
        }}>
          Enroll Now
        </Button>
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
</Box>
</DashboardContext.Provider>
);
};

const App = () => {
const queryClient = new QueryClient();

return (
<QueryClientProvider client={queryClient}>
  <ChakraProvider theme={theme}>
    <DndProvider backend={HTML5Backend}>
      <Dashboard />
    </DndProvider>
  </ChakraProvider>
</QueryClientProvider>
);
};

export default App;