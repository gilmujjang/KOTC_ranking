import { useState, useContext, useRouter } from 'react'
import classNames from 'classnames'
import { dbService } from '../../src/fbase'
import styles from "../../src/public/css/public_createGroup.module.css"
import Header from "../../src/index/component/Header"
import Footer from "../../src/index/component/Footer"
import UserObjContext from '../../src/contextAPI/UserObjContext'

const public_createGroup = () => {
  const [userObj, setUserObj] = useContext(UserObjContext)
  const [groupInfo, setGroupInfo] = useState({
    group_name: '',
    group_introduce: ''
  })

  const { group_name, group_introduce } = groupInfo

  function getInputChange(e) {
    const { name, value } = e.target
    setGroupInfo({
      ...groupInfo,
      [name]: value
    })
  }

  function createGroup() {
    dbService.collection(group_name).doc('group information').set(groupInfo)
    .then(() => {
      console.log('Success setting new group')
    })
    .catch((error) => {
      console.log('Error setting new group', error)
    })
    .then(() => {
      dbService.collection(group_name).doc('group operators').collection('운영자 목록').doc(userObj.name).set({
        operator_name: userObj.name,
        operator_displayName:userObj.displayName
      })
    })
    .then(() => {
      console.log("Success setting group's first operator")
    })
    .catch((error) => {
      console.log("Error setting group's first operator", error)
    })
    .then(() => {
      dbService.collection(group_name).doc('group members').collection('멤버 목록').doc(userObj.name).set({
        name: userObj.name,
        displayName: userObj.displayName,
        else: '나머지 정보 추후 추가 필요'
        // 추가 정보 기입 하면 필요
      })
    })
    .then(() => {
      console.log("Success setting group's first member")
    })
    .catch((error) => {
      console.log("Error setting group's first member", error)
    })
  }

  return (
    <>
      <Header />
      <div className={styles.createGroup}>
        <div className={classNames({["container"]: true, [styles.container__public_createGroup]: true})}>
          <h1 className={styles.title}>그룹 생성하기</h1>
          <div className={styles.createGroup__form}>
            <div className={styles.createGroup__name}>
              <span>그룹 이름 :&nbsp;</span><input type="text" name="group_name" className="input__text" onChange={getInputChange} value={group_name} />
            </div>
            <div className={styles.createGroup__introduce}>
              <span>그룹 소개 :&nbsp;</span><input type="text" name="group_introduce" className="input__text" onChange={getInputChange} value={group_introduce} />
            </div>
          </div>
          <div className={classNames({["button__index"]: true, [styles.button__public_createGroup]: true})} onClick={createGroup} >생성하기</div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default public_createGroup