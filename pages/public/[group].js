import { useEffect, useState } from 'react'
import { dbService } from '../../src/fbase'
import { useRouter } from 'next/router'
import styles from '../../src/public/css/team_main.module.css'
import Nav from "../../src/public/component/Nav"
import Ranking from "../../src/public/component/Ranking"
import MemberList from "../../src/public/component/MemberList"
import Community from "../../src/public/component/Community"
import RecentGame from "../../src/public/component/RecentGame"
// import Ad from "../../src/public/component/Ad"

const group_main = () => {
  const router = useRouter()
  const { group } = router.query
  console.log(group);
  const groupName = group
  const [content, setContent] = useState('community')
  const [groupPlayers, setGroupPlayers] = useState([]);
  const [wholeGames, setWholeGames] = useState([]);

  async function getGroupPlayers() {
    const querySnapshot = await dbService.collection(group).doc('group_data').collection('players').get()
    querySnapshot.forEach(doc => {
      const singlePlayerObject = {
        name: doc.data().name,
        photoURL: doc.data().photoURL,
        joined_date: doc.data().joined_date,
        rating: doc.data().rating,
        game_all: doc.data().game_all,
        game_win: doc.data().game_win,
        game_lose: doc.data().game_lose,
        status: doc.data().status,
        start_rating: doc.data().start_rating,
        introduce: doc.data().introduce
      }
      setGroupPlayers(groupPlayers => [...groupPlayers, singlePlayerObject])
    })
    groupPlayers.sort((a, b) => b.rating - a.rating)
  }

  async function getWholeGames() {
    const querySnapshot = await dbService.collection(group).doc('group_data').collection('games').orderBy("write_time","desc").limit(10).get()
    querySnapshot.forEach(doc => {
      const singleGameObject = {
        winners: doc.data().winners,
        losers: doc.data().losers,
        rating_change: doc.data().rating_change,
        percentage: doc.data().percentage,
        date: doc.data().date,
        time: doc.data().write_time,
        id: `${doc.data().date}-${doc.data().write_time}`,
        winner_rating_after: doc.data().winner_rating_after,
        loser_ratingafter: doc.data().loser_ratingafter
      }
      setWholeGames(wholeGames => [...wholeGames, singleGameObject]);
    })
  }

  useEffect(() => {
    getGroupPlayers()
    getWholeGames()
  }, [])

  return (
    <div className={styles.publicContainer}>
      <Nav setContent={setContent} />
      <div className={styles.teamContainer}>
        {content === 'ranking' && <Ranking groupPlayers={groupPlayers} />}
        {content === 'member list' && <MemberList groupName={groupName} groupPlayers={groupPlayers} />}
        {content === 'community' && <Community />}
      </div>
      {content !== 'community' &&
      <div className={styles.aside}>
        <div className={styles.aside1}>
          <RecentGame wholeGames={wholeGames} />
        </div>
        <div className={styles.aside2}>
          <h2>aside2</h2>
        </div>
      </div>
      }
    </div>
  )
}

export default group_main