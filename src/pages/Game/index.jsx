import { Link } from 'react-router-dom'
import styles from './Game.module.css'

const STATUS_CLASS = {
  'Complete': styles.statusComplete,
  'In Progress': styles.statusInProgress,
  'Planning': styles.statusPlanning,
}

const DIFFICULTY_CLASS = {
  'Beginner': styles.difficultyBeginner,
  'Intermediate': styles.difficultyIntermediate,
  'Advanced': styles.difficultyAdvanced,
}

const CARD_STATUS_CLASS = {
  'Complete': styles.cardStatusComplete,
  'In Progress': styles.cardStatusInProgress,
  'Planning': styles.cardStatusPlanning,
}

function Game() {
  const implementations = [
    {
      id: 1,
      title: "Mock Minesweeper Game",
      description: "A fully functional minesweeper implementation with timer, flagging, and win/lose detection.",
      author: "Example Implementation",
      link: "/mock-game",
      difficulty: "Beginner",
      status: "Complete"
    },
    {
      id: 5,
      title: "Minesweeper - Maksym Klushyn",
      description: "My implementation of the classic Minesweeper game in React using a modern component-based architecture.",
      author: "Maksym Klushyn",
      link: "/klushyn-maksym",
      difficulty: "Intermediate",
    id: "zhuk-yaroslav", 
    title: "Minesweeper React",
    description: "Реалізація гри Сапер на React (Практична 4)",
    author: "Ярослав Жук",
    link: "/zhuk-yaroslav",
    difficulty: "Intermediate",
    status: "Complete"
    },
    {
      id: 2,
      title: "Basic Minesweeper",
      description: "A simple implementation with basic game mechanics",
      author: "Author Name",
      link: "#",
      difficulty: "Beginner",
      status: "Complete"
    },
    {
      id: 3,
      title: "Advanced Minesweeper",
      description: "Features timer, high scores, and custom difficulty",
      author: "Author name",
      link: "#",
      difficulty: "Intermediate",
      status: "In Progress"
    },
    {
      id: 4,
      title: "Minesweeper with Themes",
      description: "Multiple visual themes and sound effects",
      author: "Author name",
      link: "#",
      difficulty: "Advanced",
      status: "Planning"
    },
    {
      id: 5,
      title: "Сапер (компоненти + CSS Modules)",
      description: "Поле 6×8, 10 мін, таймер, прапорці, перемога/програш.",
      author: "Шевеля Вікторія",
      link: "/shevelia-viktoriia",
      difficulty: "Beginner",
      status: "Complete"
    }
  ]

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameHeader}>
        <h1>Student Implementations</h1>
        <p>Browse student minesweeper implementations</p>
      </div>

      <div className={styles.implementationsList}>
        {implementations.map((impl) => (
          <div key={impl.id} className={[styles.implementationCard, CARD_STATUS_CLASS[impl.status]].filter(Boolean).join(' ')}>
            <div className={styles.cardHeader}>
              <h3>{impl.title}</h3>
              <div className={styles.badges}>
                <span className={[styles.badge, STATUS_CLASS[impl.status]].filter(Boolean).join(' ')}>{impl.status}</span>
                <span className={[styles.badge, DIFFICULTY_CLASS[impl.difficulty]].filter(Boolean).join(' ')}>{impl.difficulty}</span>
              </div>
            </div>
            <p className={styles.author}>by {impl.author}</p>
            <p className={styles.description}>{impl.description}</p>
            <div className={styles.cardActions}>
              <Link to={impl.link} className={styles.linkBtn}>View Implementation →</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Game