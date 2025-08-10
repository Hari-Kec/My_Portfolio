import React, { useState } from 'react'
import HeroBgAnimation from '../HeroBgAnimation'
import { 
    HeroContainer, HeroBg, HeroLeftContainer, Img, HeroRightContainer, 
    HeroInnerContainer, TextLoop, Title, Span, SubTitle, ResumeButton, 
    ChatButton, ChatPopup, ChatHeader, ChatBody, ChatMessage, ChatInputWrapper, 
    ChatInput, CloseButton, ButtonRow
} from './HeroStyle'
import { FaUserCircle, FaRobot, FaPaperPlane } from 'react-icons/fa'
import HeroImg from '../../images/HeroImage.jpg'
import Typewriter from 'typewriter-effect';
import { Bio } from '../../data/constants';

const HeroSection = () => {
    const [chatOpen, setChatOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: "bot", text: "Hi! I'm your portfolio assistant. Ask me anything about my work!" }
    ]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (input.trim() === "") return;

        const userMsg = { sender: "user", text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");

        try {
            const res = await fetch("https://my-portfolio-u8yp.onrender.com/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg.text })
            });

            const data = await res.json();
            const botMsg = { sender: "bot", text: data.reply };
            setMessages(prev => [...prev, botMsg]);
        } catch {
            setMessages(prev => [...prev, { sender: "bot", text: "Error connecting to AI." }]);
        }
    };

    return (
        <div id="about">
            <HeroContainer>
                <HeroBg>
                    <HeroBgAnimation />
                </HeroBg>
                <HeroInnerContainer>
                    <HeroLeftContainer>
                        <Title>Hi, I am <br /> {Bio.name}</Title>
                        <TextLoop>
                            I am a
                            <Span>
                                <Typewriter
                                    options={{
                                        strings: Bio.roles,
                                        autoStart: true,
                                        loop: true,
                                    }}
                                />
                            </Span>
                        </TextLoop>
                        <SubTitle>{Bio.description}</SubTitle>
                        <ButtonRow>
    <ResumeButton href={Bio.resume} target='display'>Check Resume</ResumeButton>
    <ChatButton onClick={() => setChatOpen(!chatOpen)}>Chat With Me</ChatButton>
</ButtonRow>

                    </HeroLeftContainer>

                    <HeroRightContainer>
                        <Img src={HeroImg} alt="hero-image" />
                    </HeroRightContainer>
                </HeroInnerContainer>

                {chatOpen && (
                    <ChatPopup>
                        <ChatHeader>
                            Chat With Me
                            <CloseButton onClick={() => setChatOpen(false)}>✖</CloseButton>
                        </ChatHeader>
                        <ChatBody>
                            {messages.map((msg, index) => (
                                <ChatMessage key={index} sender={msg.sender}>
                                    {msg.sender === "bot" ? <FaRobot size={20} /> : <FaUserCircle size={20} />}
                                    <span>{msg.text}</span>
                                </ChatMessage>
                            ))}
                        </ChatBody>
                        <ChatInputWrapper>
                            <ChatInput
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your message..."
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            />
                            <button onClick={sendMessage}><FaPaperPlane /></button>
                        </ChatInputWrapper>
                    </ChatPopup>
                )}

                {!chatOpen && (
                    <button
                        style={{
                            position: "fixed",
                            bottom: "20px",
                            right: "20px",
                            backgroundColor: "#6c63ff",
                            color: "white",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            border: "none",
                            cursor: "pointer",
                            fontSize: "20px",
                            zIndex: 2000
                        }}
                        onClick={() => setChatOpen(true)}
                    >
                        💬
                    </button>
                )}
            </HeroContainer>
        </div>
    )
}

export default HeroSection
