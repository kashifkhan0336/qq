import { useEffect, useState, createContext, useContext } from "react";
import "./App.css";
import {
  DatePicker,
  message,
  Radio,
  Space,
  Typography,
  Divider,
  Statistic,
  Result,
  Button,
  Modal,
  Row,
  Layout,
} from "antd";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from "recoil";
const { Title } = Typography;
const { Countdown } = Statistic;
const { Header, Footer, Sider, Content } = Layout;
// const deadline = Date.now() + 0.3 * 60000;
import "antd/dist/antd.css";
import eventBus from "./Eventbus";

export const UserContext = createContext();

function Questions({ isDisabled, questions }) {
  const value = useContext(UserContext);
  console.log(value);
  return questions.map((ques, index) => {
    return (
      <Question
        key={index}
        isDisabled={isDisabled}
        question={ques.question}
        options={ques.options}
        isCountdownFinished={value}
      />
    );
  });
}

function App() {
  useEffect(() => {
    eventBus.on("sent_answers", (data) => {
      console.log(data);
      addAnswer((a) => [...a, data]);
    });
  }, []);
  const [answers, addAnswer] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDisabled, setDisable] = useState(false);
  const [isCountdownFinished, setCountdownFinished] = useState(false);
  const [deadline, setDeadline] = useState(Date.now() + 0.3 * 60000);
  const quiz_questions = [
    {
      question: "What your Name?",
      options: [
        {
          text: "Kashif",
          isCorrect: true,
        },
        {
          text: "Maaz",
          isCorrect: false,
        },
        {
          text: "Fawad",
          isCorrect: false,
        },
        {
          text: "Panoti",
          isCorrect: false,
        },
      ],
    },
    {
      question: "What your Name?",
      options: [
        {
          text: "Kashif",
          isCorrect: true,
        },
        {
          text: "Maaz",
          isCorrect: false,
        },
        {
          text: "Fawad",
          isCorrect: false,
        },
        {
          text: "Panoti",
          isCorrect: false,
        },
      ],
    },
    {
      question: "What your Age?",
      options: [
        {
          text: "18",
          isCorrect: true,
        },
        {
          text: "22",
          isCorrect: false,
        },
        {
          text: "24",
          isCorrect: false,
        },
        {
          text: "19",
          isCorrect: false,
        },
      ],
    },
  ];
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function onFinish() {
    setCountdownFinished(true);
    showModal();
    setDisable(true);
  }
  function quizSubmitted() {
    setDeadline(Date.now());
    onFinish();
  }

  return (
    <UserContext.Provider value={isCountdownFinished}>
      <>
        <Countdown
          title="Countdown"
          value={deadline}
          format="HH:mm:ss:SSS"
          onFinish={onFinish}
          style={{ float: "right" }}
        />
        <Questions isDisabled={isDisabled} questions={quiz_questions} />

        <Modal
          title=""
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Result
            status="success"
            title="Successfully concluded your quiz!"
            extra={[
              <Button type="primary" key="console">
                Check Results
              </Button>,
            ]}
          />
        </Modal>
        <Button onClick={() => quizSubmitted()}>Submit</Button>
      </>
    </UserContext.Provider>
  );
}

function Question({ question, options, isDisabled, isCountdownFinished }) {
  const [radioVal, setRadioVal] = useState(1);
  const [answer, setAnswer] = useState("");

  if (isCountdownFinished && !answer) {
    console.log(radioVal);
    console.log(`User selected answer -> ${options[radioVal].text}`);
    console.log(
      `Right answer -> ${options.filter((op) => op.isCorrect)[0].text}`
    );
    const answer_object = {
      user_selected: options[radioVal].text,
      right_answer: options.filter((op) => op.isCorrect)[0].text,
    };
    setAnswer("lalli");
    eventBus.dispatch("sent_answers", answer_object);

    // );
  }
  return (
    <div style={{ margin: "50px" }}>
      <Space direction="vertical">
        <Title level={4} copyable={false}>
          {question}
        </Title>
        <Radio.Group
          disabled={isDisabled}
          onChange={(e) => {
            setRadioVal(e.target.value);
          }}
          value={radioVal}
        >
          <Space direction="vertical">
            <Radio value={0}>{options[0].text}</Radio>
            <Radio value={1}>{options[1].text}</Radio>
            <Radio value={2}>{options[2].text}</Radio>
            <Radio value={3}>{options[3].text}</Radio>
          </Space>
        </Radio.Group>
      </Space>
    </div>
  );
}
export default App;
