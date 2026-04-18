import type { Sermon } from "@/types/sermon";
import type { ChurchEvent } from "@/types/event";
import type { Ministry, TeamMember } from "@/types/ministry";
import type { BlogPost } from "@/types/blog";

export const mockSermons: Sermon[] = [
  {
    id: "dQw4w9WgXcQ",
    title: "Walking in the Light of Christ",
    description:
      "In this powerful message, Fr. Yesudas explores what it means to live as children of light in a dark world, drawing from John 8:12 and practical wisdom for daily Christian living.",
    thumbnailUrl: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    publishedAt: "2026-03-23T10:00:00Z",
    duration: "52:18",
    tags: ["faith", "light", "gospel"],
    series: "Gospel of John",
  },
  {
    id: "xvFZjo5PgG0",
    title: "The Power of Intercessory Prayer",
    description:
      "Fr. Yesudas teaches on the transformative power of praying for others, exploring biblical examples from Moses, Elijah, and the Apostle Paul.",
    thumbnailUrl: "https://i.ytimg.com/vi/xvFZjo5PgG0/hqdefault.jpg",
    publishedAt: "2026-03-16T10:00:00Z",
    duration: "48:42",
    tags: ["prayer", "intercession"],
    series: "Prayer Life",
  },
  {
    id: "M7lc1UVf-VE",
    title: "Grace and Truth: A Study of John 1",
    description:
      "A verse-by-verse exposition of the prologue of John's Gospel, revealing the eternal nature of Christ and the grace He brings to humanity.",
    thumbnailUrl: "https://i.ytimg.com/vi/M7lc1UVf-VE/hqdefault.jpg",
    publishedAt: "2026-03-09T10:00:00Z",
    duration: "55:30",
    tags: ["grace", "truth", "John"],
    series: "Gospel of John",
  },
  {
    id: "2Vv-BfVoq4g",
    title: "Healing and Wholeness in Christ",
    description:
      "An exploration of the healing miracles of Jesus and how God's restorative power is available to believers today — spirit, soul, and body.",
    thumbnailUrl: "https://i.ytimg.com/vi/2Vv-BfVoq4g/hqdefault.jpg",
    publishedAt: "2026-03-02T10:00:00Z",
    duration: "44:15",
    tags: ["healing", "faith", "miracles"],
  },
  {
    id: "kJQP7kiw5Fk",
    title: "Living by the Spirit",
    description:
      "Understanding the role of the Holy Spirit in the life of every believer, from Galatians 5 and Acts 2.",
    thumbnailUrl: "https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg",
    publishedAt: "2026-02-23T10:00:00Z",
    duration: "49:50",
    tags: ["Holy Spirit", "Galatians"],
    series: "Life in the Spirit",
  },
  {
    id: "9bZkp7q19f0",
    title: "The Beatitudes: A Path to True Happiness",
    description:
      "Fr. Yesudas unpacks each beatitude from the Sermon on the Mount, showing how Christ's kingdom values transform ordinary life.",
    thumbnailUrl: "https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg",
    publishedAt: "2026-02-16T10:00:00Z",
    duration: "58:20",
    tags: ["Sermon on the Mount", "beatitudes"],
    series: "Sermon on the Mount",
  },
  {
    id: "OPf0YbXqDm0",
    title: "Forgiveness: The Heart of the Gospel",
    description:
      "Why forgiveness is central to Christian life — receiving God's forgiveness and extending it to others.",
    thumbnailUrl: "https://i.ytimg.com/vi/OPf0YbXqDm0/hqdefault.jpg",
    publishedAt: "2026-02-09T10:00:00Z",
    duration: "46:05",
    tags: ["forgiveness", "gospel"],
  },
  {
    id: "hT_nvWreIhg",
    title: "Faith That Moves Mountains",
    description:
      "Building genuine, active faith through the stories of Abraham, Moses, and the heroes of Hebrews 11.",
    thumbnailUrl: "https://i.ytimg.com/vi/hT_nvWreIhg/hqdefault.jpg",
    publishedAt: "2026-02-02T10:00:00Z",
    duration: "51:33",
    tags: ["faith", "Hebrews"],
    series: "Faith Foundations",
  },
];

export const mockEvents: ChurchEvent[] = [
  {
    id: "evt-001",
    title: "Sunday Worship Service",
    description:
      "Join us every Sunday for spirit-filled worship, Scripture readings, and a message from Fr. Yesudas. All are welcome.",
    date: "2026-04-06",
    time: "9:00 AM",
    endTime: "11:00 AM",
    location: "Main Sanctuary",
    type: "sunday-service",
    isRecurring: true,
  },
  {
    id: "evt-002",
    title: "Good Friday Service",
    description:
      "A solemn service of reflection and worship commemorating the crucifixion of Jesus Christ.",
    date: "2026-04-03",
    time: "6:00 PM",
    endTime: "8:00 PM",
    location: "Main Sanctuary",
    type: "special",
  },
  {
    id: "evt-003",
    title: "Easter Sunday Celebration",
    description:
      "Celebrate the Resurrection of Jesus Christ! Special worship, testimonies, and a festive message. Invite friends and family.",
    date: "2026-04-05",
    time: "8:00 AM",
    endTime: "10:30 AM",
    location: "Main Sanctuary",
    type: "special",
  },
  {
    id: "evt-004",
    title: "Wednesday Prayer Night",
    description:
      "Midweek prayer gathering — intercession, worship, and studying the Word together.",
    date: "2026-04-08",
    time: "7:00 PM",
    endTime: "9:00 PM",
    location: "Prayer Hall",
    type: "prayer",
    isRecurring: true,
  },
  {
    id: "evt-005",
    title: "Youth Retreat 2026",
    description:
      "A two-day retreat for young people aged 13-30, focused on identity in Christ and calling.",
    date: "2026-04-18",
    time: "8:00 AM",
    location: "Retreat Center, Vizag",
    type: "retreat",
    registrationUrl: "#",
  },
  {
    id: "evt-006",
    title: "Community Outreach Day",
    description:
      "Join us as we serve the local community with food distribution, medical camps, and the love of Christ.",
    date: "2026-04-25",
    time: "9:00 AM",
    endTime: "4:00 PM",
    location: "Community Hall",
    type: "community",
  },
];

export const mockMinistries: Ministry[] = [
  {
    id: "min-worship",
    name: "Worship Ministry",
    description:
      "Leading the congregation in Spirit-filled worship through music, prayer, and praise.",
    fullDescription:
      "Our Worship Ministry exists to create an atmosphere where people encounter the living God through music and praise. From contemporary worship to traditional hymns, we express our love for Jesus through song.",
    imageUrl: "/images/ministries/worship.jpg",
    leader: "Bro. Samuel John",
    schedule: "Sundays 8:00 AM & Wednesdays 6:30 PM",
    tags: ["music", "praise", "prayer"],
  },
  {
    id: "min-youth",
    name: "Youth Ministry",
    description:
      "Discipling the next generation in faith, character, and purpose for God's Kingdom.",
    fullDescription:
      "Youth Ministry invests in young people aged 13–30, helping them discover their identity in Christ and equipping them for a life of purpose and impact.",
    imageUrl: "/images/ministries/youth.jpg",
    leader: "Sis. Priya Thomas",
    schedule: "Saturdays 5:00 PM",
    tags: ["youth", "discipleship", "leadership"],
  },
  {
    id: "min-prayer",
    name: "Prayer Ministry",
    description:
      "Interceding for individuals, families, the church, and the nation through fervent prayer.",
    fullDescription:
      "Our Prayer Ministry is the backbone of the church — a dedicated team of intercessors who stand in the gap for every need, believing in the power of prayer to change lives and circumstances.",
    imageUrl: "/images/ministries/prayer.jpg",
    leader: "Sis. Mary Esther",
    schedule: "Wednesdays 7:00 PM & Fridays 6:00 AM",
    tags: ["intercession", "prayer", "spiritual warfare"],
  },
  {
    id: "min-outreach",
    name: "Outreach & Compassion",
    description:
      "Serving the poor, the sick, and the marginalized with the compassion of Christ.",
    fullDescription:
      "The Outreach Ministry takes the Gospel beyond the church walls — through hospital visits, orphan care, food distribution, and community development programs.",
    imageUrl: "/images/ministries/outreach.jpg",
    leader: "Bro. Paul David",
    schedule: "Last Saturday of every month",
    tags: ["missions", "compassion", "community"],
  },
  {
    id: "min-children",
    name: "Children's Ministry",
    description:
      "Planting seeds of faith in children through Bible stories, worship, and creative learning.",
    fullDescription:
      "We believe that children can have a genuine, living faith. Our Children's Ministry creates a fun and safe environment where kids from 3 to 12 years can encounter God's love.",
    imageUrl: "/images/ministries/children.jpg",
    leader: "Sis. Ruth Joy",
    schedule: "Sundays during main service",
    tags: ["children", "education", "fun"],
  },
];

export const mockTeamMembers: TeamMember[] = [
  {
    id: "tm-001",
    name: "Fr. Yesudas",
    role: "Founder & Senior Pastor",
    bio: "Fr. Yesudas has been in ministry for over 25 years, with a calling to bring the Gospel to the unreached. He is known for his powerful teaching, healing ministry, and deep compassion for the lost.",
    imageUrl: "/images/team/fr-yesudas.jpg",
  },
  {
    id: "tm-002",
    name: "Sr. Leela Yesudas",
    role: "Co-Pastor & Women's Ministry Leader",
    bio: "Sr. Leela leads the women's ministry with grace and wisdom, discipling women in faith, family, and purpose. She is a gifted teacher and counselor.",
    imageUrl: "/images/team/sr-leela.jpg",
  },
  {
    id: "tm-003",
    name: "Bro. Samuel John",
    role: "Worship Director",
    bio: "Samuel leads the church in worship with excellence and authenticity, creating an atmosphere where hearts are opened to the presence of God.",
    imageUrl: "/images/team/samuel.jpg",
  },
  {
    id: "tm-004",
    name: "Bro. Paul David",
    role: "Outreach Coordinator",
    bio: "Paul coordinates all outreach and compassion efforts of the ministry, overseeing programs that serve thousands in need across the region.",
    imageUrl: "/images/team/paul.jpg",
  },
];

export const causesLabels: Record<string, string> = {
  general: "General Fund",
  building: "Building & Facilities",
  missions: "Mission Support",
  compassion: "Compassion Ministry",
  youth: "Youth Ministry",
};

export const mockBlogPosts: BlogPost[] = [
  {
    slug: "walking-in-the-light-of-christ",
    title: "Walking in the Light of Christ",
    date: "2026-03-24",
    excerpt:
      "In a world filled with darkness and confusion, Jesus calls us to be children of light. What does it practically mean to walk in the light — and how does it transform every area of our lives?",
    author: "Fr. Yesudas",
    authorRole: "Founder & Senior Pastor",
    readTime: "6 min read",
    tags: ["faith", "light", "gospel", "daily living"],
    category: "devotional",
    content: `<p>In John 8:12, Jesus declares, <em>"I am the light of the world. Whoever follows me will never walk in darkness, but will have the light of life."</em> This is one of the most profound promises in all of Scripture — and it is for you, today.</p>

<h2>What Does It Mean to Walk in the Light?</h2>
<p>Walking in the light is not merely an abstract spiritual concept. It is a daily, intentional choosing of Christ over self — of truth over deception, of love over bitterness, of faith over fear.</p>
<p>The Apostle John writes in his first epistle: <em>"If we walk in the light, as he is in the light, we have fellowship with one another, and the blood of Jesus his Son cleanses us from all sin"</em> (1 John 1:7). Notice that walking in the light is connected to two gifts: fellowship and cleansing. Where there is light, there is community. Where there is light, there is purity.</p>

<h2>Three Practical Steps</h2>
<p><strong>1. Begin each day in the Word.</strong> The Psalmist says, "Your word is a lamp to my feet and a light to my path" (Psalm 119:105). Before your phone, before the news, open the Scriptures. Let God speak first.</p>
<p><strong>2. Confess and release.</strong> Unconfessed sin dims the light within us. Make it a habit to come before the Lord in honest, humble confession. He is faithful and just to forgive.</p>
<p><strong>3. Be a carrier of light.</strong> Matthew 5:14 says you are the light of the world — not just Jesus living within you, but you, shining outward. Your kindness, your honesty, your joy in suffering — these are beams of light in a dark world.</p>

<h2>A Prayer</h2>
<p>Lord Jesus, You are the light of the world. Today I choose to follow You. Illuminate every dark corner of my heart. Let Your light shine through me to everyone I meet. In Your holy name, Amen.</p>`,
  },
  {
    slug: "power-of-intercessory-prayer",
    title: "The Transforming Power of Intercessory Prayer",
    date: "2026-03-17",
    excerpt:
      "When we pray for others, something supernatural happens — not just in their lives, but in ours. Discover the biblical foundation and life-changing practice of intercession.",
    author: "Fr. Yesudas",
    authorRole: "Founder & Senior Pastor",
    readTime: "8 min read",
    tags: ["prayer", "intercession", "spiritual disciplines"],
    category: "teaching",
    content: `<p>Intercession is one of the most selfless acts a believer can offer. To stand in the gap for another person — to carry their burdens before the throne of God — is to participate in the very ministry of Jesus Christ, who "always lives to make intercession" for us (Hebrews 7:25).</p>

<h2>Biblical Models of Intercession</h2>
<p><strong>Moses:</strong> When Israel sinned with the golden calf, God threatened to destroy the nation. Moses interceded with remarkable boldness: <em>"But now, please forgive their sin — but if not, then blot me out of the book you have written"</em> (Exodus 32:32). This is extraordinary love — offering yourself on behalf of others.</p>
<p><strong>Elijah:</strong> On Mount Carmel, Elijah prayed seven times before the rain came (1 Kings 18:41-46). Perseverance in prayer is not a sign of doubt — it is a sign of faith.</p>
<p><strong>The Apostle Paul:</strong> Paul was constantly interceding. He told the Romans, <em>"God, whom I serve in my spirit in preaching the gospel of his Son, is my witness how constantly I remember you in my prayers"</em> (Romans 1:9-10).</p>

<h2>How to Develop an Intercessory Prayer Life</h2>
<p>Start small. Keep a prayer list — names of family, friends, neighbours, leaders, and nations. Pray through it each morning. As you do, you will notice something unexpected: your heart will begin to change. You will find yourself caring more deeply for the very people you are praying for. Intercession transforms the intercessor.</p>
<p>Pray Scripture. Instead of vague "bless them" prayers, pray the promises of God over specific people. Pray Ephesians 1:17-19 over your children. Pray Philippians 4:7 over an anxious friend. The Word of God is "living and active" — it accomplishes what God intends.</p>

<h2>You Are a Priest</h2>
<p>The New Testament declares that believers are "a royal priesthood" (1 Peter 2:9). The role of a priest is to represent the people before God. You have been given this sacred privilege. Use it daily.</p>`,
  },
  {
    slug: "easter-the-hope-that-changes-everything",
    title: "Easter: The Hope That Changes Everything",
    date: "2026-04-05",
    excerpt:
      "The resurrection of Jesus Christ is not a religious legend or a metaphor — it is the hinge of all history. This Easter, let the reality of the empty tomb reshape how you live.",
    author: "Fr. Yesudas",
    authorRole: "Founder & Senior Pastor",
    readTime: "7 min read",
    tags: ["easter", "resurrection", "hope", "gospel"],
    category: "devotional",
    content: `<p>Every year, the Church around the world gathers to proclaim the most radical statement in human history: <em>He is risen.</em> Not "he was a good teacher." Not "his memory lives on." He. Is. Risen.</p>

<h2>Why the Resurrection Matters</h2>
<p>The Apostle Paul was blunt about the stakes: <em>"If Christ has not been raised, your faith is futile; you are still in your sins"</em> (1 Corinthians 15:17). Everything hinges on this. The resurrection is not an optional add-on to the Christian faith — it is the foundation.</p>
<p>But because Christ is raised, we have certainty that:</p>
<ul>
  <li>Our sins are truly forgiven (Romans 4:25)</li>
  <li>Death has lost its sting (1 Corinthians 15:55)</li>
  <li>We too will be raised (1 Thessalonians 4:14)</li>
  <li>Every prayer we pray is heard by a living Saviour (Hebrews 7:25)</li>
</ul>

<h2>The Empty Tomb and Your Empty Places</h2>
<p>Perhaps you come to Easter carrying grief, failure, sickness, or despair. The angel's words at the tomb are for you: <em>"Why do you look for the living among the dead? He is not here; he has risen!"</em> (Luke 24:5-6).</p>
<p>The same power that raised Jesus from the dead is at work in you (Romans 8:11). Whatever is dead in your life — your hope, your marriage, your faith, your health — bring it to the Risen Christ. He specialises in resurrection.</p>

<h2>Live as a Resurrection People</h2>
<p>Easter is not just a Sunday. It is a posture — a way of facing every Monday through Saturday with the confidence that the worst thing is never the last thing. Because of Jesus, every ending is also a beginning.</p>
<p>He is risen. He is risen indeed. Alleluia.</p>`,
  },
  {
    slug: "youth-retreat-2026-testimonies",
    title: "What God Did at Youth Retreat 2026",
    date: "2026-04-22",
    excerpt:
      "Over 120 young people gathered at the retreat centre in Vizag — and nothing was the same when they left. Here are some of the stories of what God did.",
    author: "Sis. Priya Thomas",
    authorRole: "Youth Ministry Leader",
    readTime: "5 min read",
    tags: ["youth", "testimony", "retreat", "revival"],
    category: "testimony",
    content: `<p>When we set out for the Youth Retreat 2026, we believed God was going to move. What we did not fully anticipate was just how personally, deeply, and specifically He would work in the hearts of the young people who came.</p>

<h2>The Numbers</h2>
<p>Over two days, 124 young people from ages 13 to 28 gathered at the Retreat Centre in Vizag. We had worship sessions, Bible teaching, small group discussions, and extended times of prayer and ministry.</p>

<h2>A Few Stories</h2>
<p><strong>Arun, 19:</strong> "I came because my parents told me to. I left because I encountered Jesus. On Saturday night during prayer, I felt the Holy Spirit fall on me for the first time in my life. I have been a church boy all my life — but now I am a believer."</p>
<p><strong>Divya, 22:</strong> "I had been carrying unforgiveness against my father for three years. During the teaching on Joseph, God broke something in me. I called my father on Sunday morning and told him I forgive him. He cried. I cried. It was the best phone call of my life."</p>
<p><strong>Nathan, 16:</strong> "I gave my life to Christ on Friday evening. I don't have big words. I just know I am different now."</p>

<h2>What's Next</h2>
<p>We are forming discipleship groups for the young people who made first-time commitments. If you are a parent, mentor, or church leader, please pray for these young people as they begin their walk with Christ.</p>
<p>To all who prayed, gave, and served to make this retreat possible — thank you. You have invested in eternity.</p>`,
  },
  {
    slug: "community-outreach-april-2026",
    title: "Ministry Update: April Outreach Day",
    date: "2026-04-28",
    excerpt:
      "On April 25th, over 80 volunteers served the community with food, medical care, and the love of Christ. Here's what happened and what we need next.",
    author: "Bro. Paul David",
    authorRole: "Outreach Coordinator",
    readTime: "4 min read",
    tags: ["outreach", "compassion", "community", "ministry"],
    category: "ministry-update",
    content: `<p>Saturday, April 25th was one of the most fruitful outreach days we have had this year. From early morning to late afternoon, over 80 volunteers from Fr. Yesudas Ministries fanned out across the community — and the results were beyond what we expected.</p>

<h2>What We Did</h2>
<ul>
  <li><strong>Food Distribution:</strong> We distributed 340 food packages to families in the Gajuwaka area, including rice, dal, oil, and vegetables.</li>
  <li><strong>Medical Camp:</strong> Our volunteer medical team saw 97 patients, providing free consultations, blood pressure checks, and basic medication.</li>
  <li><strong>Children's Programme:</strong> We ran a morning programme for 65 children, with songs, Bible stories, and a meal.</li>
  <li><strong>Prayer Ministry:</strong> Our prayer team prayed with 52 individuals who requested prayer — many for healing, some for salvation.</li>
</ul>

<h2>What God Did</h2>
<p>Three people made first-time decisions to follow Christ during the day. One elderly woman who had never heard the Gospel in her own language heard it in Telugu for the first time — and wept as she prayed to receive Jesus.</p>
<p>One of our medical volunteers, Dr. Anitha, shared: "I am a doctor, but days like this remind me that the greatest healing is of the soul. I saw Jesus in the faces of the people we served today."</p>

<h2>How You Can Help</h2>
<p>Our next outreach is planned for May 30th. We need volunteers, supplies, and financial support. To give toward outreach, visit our <a href="/give">Give page</a> and select "Compassion Ministry." Every rupee counts.</p>`,
  },
  {
    slug: "grace-and-truth-john-1",
    title: "Grace and Truth: A Study of John 1",
    date: "2026-03-10",
    excerpt:
      "The prologue of John's Gospel packs more theology into 18 verses than most books of the Bible. Here is a devotional walk through these magnificent words.",
    author: "Fr. Yesudas",
    authorRole: "Founder & Senior Pastor",
    readTime: "10 min read",
    tags: ["Bible study", "John", "grace", "truth", "teaching"],
    category: "teaching",
    content: `<p>Open your Bible to John 1:1 and you are immediately standing on holy ground. <em>"In the beginning was the Word, and the Word was with God, and the Word was God."</em> John is doing something radical here: he is reaching back to the first words of Genesis ("In the beginning...") and declaring that Jesus, the eternal Word, was already there — not created, but Creator.</p>

<h2>The Word Became Flesh (v.14)</h2>
<p>The climax of the prologue arrives at verse 14: <em>"The Word became flesh and made his dwelling among us."</em> The Greek word for "made his dwelling" is <em>eskēnōsen</em> — it literally means "tabernacled" or "pitched his tent." John is deliberately invoking the memory of the Tabernacle in the wilderness, where God's glory dwelt with Israel.</p>
<p>But now something far greater has happened. God has not merely entered a tent made of fabric and wood. He has taken on human flesh. He has become one of us — with our limitations, our hunger, our tears.</p>

<h2>Full of Grace and Truth</h2>
<p>John tells us this incarnate Word was "full of grace and truth." These two qualities are presented together deliberately. Grace without truth becomes sentimentality — an empty kindness that never confronts or changes. Truth without grace becomes cruelty — a rigidity that crushes rather than heals.</p>
<p>Only in Jesus do we see the perfect union of both. He told the woman caught in adultery the truth: "Go and sin no more." But He also extended grace: "Neither do I condemn you." He told the rich young ruler the truth about his idol — his wealth. But He did it, Mark tells us, because He "looked at him and loved him."</p>

<h2>Grace Upon Grace (v.16)</h2>
<p>Verse 16 is one of the most precious in all of Scripture: <em>"Out of his fullness we have all received grace in place of grace already given."</em> The image is of wave upon wave — each grace replaced by a new, fresh grace. God does not exhaust His supply of goodness toward us. He does not grow tired of blessing His children.</p>
<p>Whatever season you are in today — whether you feel full or empty, faithful or failing — know this: the fullness of Jesus is available to you. All of it. Right now. Come and receive.</p>`,
  },
];
