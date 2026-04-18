import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const prisma = new (PrismaClient as any)({ adapter });

async function main() {
  console.log("Seeding database...");

  // Admin user
  const adminEmail = process.env.ADMIN_SEED_EMAIL ?? "admin@fryesudasministries.com";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, passwordHash, name: "Admin" },
  });
  console.log("✓ Admin user created:", adminEmail);

  // Blog posts
  const blogPosts = [
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
      published: true,
      content: `<p>In John 8:12, Jesus declares, <em>"I am the light of the world. Whoever follows me will never walk in darkness, but will have the light of life."</em></p>
<h2>What Does It Mean to Walk in the Light?</h2>
<p>Walking in the light is a daily, intentional choosing of Christ over self — of truth over deception, of love over bitterness, of faith over fear.</p>
<h2>Three Practical Steps</h2>
<p><strong>1. Begin each day in the Word.</strong> The Psalmist says, "Your word is a lamp to my feet and a light to my path" (Psalm 119:105).</p>
<p><strong>2. Confess and release.</strong> Unconfessed sin dims the light within us. Make it a habit to come before the Lord in honest, humble confession.</p>
<p><strong>3. Be a carrier of light.</strong> Matthew 5:14 says you are the light of the world. Your kindness, your honesty, your joy in suffering — these are beams of light in a dark world.</p>`,
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
      published: true,
      content: `<p>Intercession is one of the most selfless acts a believer can offer. To stand in the gap for another person — to carry their burdens before the throne of God — is to participate in the very ministry of Jesus Christ, who "always lives to make intercession" for us (Hebrews 7:25).</p>
<h2>Biblical Models of Intercession</h2>
<p><strong>Moses:</strong> When Israel sinned with the golden calf, God threatened to destroy the nation. Moses interceded: <em>"But now, please forgive their sin — but if not, then blot me out of the book you have written"</em> (Exodus 32:32).</p>
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
      published: true,
      content: `<p>Every year, the Church around the world gathers to proclaim the most radical statement in human history: <em>He is risen.</em></p>
<h2>Why the Resurrection Matters</h2>
<p>The Apostle Paul was blunt: <em>"If Christ has not been raised, your faith is futile; you are still in your sins"</em> (1 Corinthians 15:17). Everything hinges on this.</p>
<h2>Live as a Resurrection People</h2>
<p>Easter is not just a Sunday. It is a posture — a way of facing every Monday through Saturday with the confidence that the worst thing is never the last thing.</p>
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
      published: true,
      content: `<p>When we set out for the Youth Retreat 2026, we believed God was going to move. What we did not fully anticipate was just how personally and deeply He would work in the hearts of the young people who came.</p>
<h2>A Few Stories</h2>
<p><strong>Arun, 19:</strong> "I came because my parents told me to. I left because I encountered Jesus."</p>
<p><strong>Divya, 22:</strong> "I had been carrying unforgiveness against my father for three years. During the teaching on Joseph, God broke something in me."</p>
<p><strong>Nathan, 16:</strong> "I gave my life to Christ on Friday evening. I just know I am different now."</p>`,
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
      published: true,
      content: `<p>Saturday, April 25th was one of the most fruitful outreach days we have had this year. From early morning to late afternoon, over 80 volunteers served the community.</p>
<h2>What We Did</h2>
<ul>
  <li>Distributed 340 food packages to families</li>
  <li>Medical team saw 97 patients</li>
  <li>Children's programme for 65 children</li>
  <li>Prayer ministry with 52 individuals</li>
</ul>
<p>Three people made first-time decisions to follow Christ during the day.</p>`,
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
      published: true,
      content: `<p>Open your Bible to John 1:1 and you are immediately standing on holy ground. <em>"In the beginning was the Word, and the Word was with God, and the Word was God."</em></p>
<h2>Full of Grace and Truth</h2>
<p>John tells us this incarnate Word was "full of grace and truth." Grace without truth becomes sentimentality. Truth without grace becomes cruelty. Only in Jesus do we see the perfect union of both.</p>
<h2>Grace Upon Grace (v.16)</h2>
<p><em>"Out of his fullness we have all received grace in place of grace already given."</em> The image is of wave upon wave — each grace replaced by a new, fresh grace.</p>`,
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: { ...post, tags: post.tags },
    });
  }
  console.log("✓ Blog posts seeded:", blogPosts.length);

  // Sermons — real videos from Fr.Yesudas Ministries YouTube channel
  const sermons = [
    {
      videoId: "S06JAEA6dZc",
      title: "Fr.Yesudas Ministries Live",
      description: "Live worship and teaching from Fr. Yesudas Ministries.",
      thumbnailUrl: "https://i.ytimg.com/vi/S06JAEA6dZc/hqdefault.jpg",
      publishedAt: "2026-03-29T10:00:00Z",
      tags: ["live", "worship"],
      sortOrder: 0,
      published: true,
    },
    {
      videoId: "G3nenN0brDg",
      title: "Fr.Yesudas Ministries Live",
      description: "Live worship and teaching from Fr. Yesudas Ministries.",
      thumbnailUrl: "https://i.ytimg.com/vi/G3nenN0brDg/hqdefault.jpg",
      publishedAt: "2026-03-30T10:00:00Z",
      tags: ["live", "worship"],
      sortOrder: 1,
      published: true,
    },
    {
      videoId: "6hfIrYIu5io",
      title: "Fr.Yesudas Ministries Live",
      description: "Live worship and teaching from Fr. Yesudas Ministries.",
      thumbnailUrl: "https://i.ytimg.com/vi/6hfIrYIu5io/hqdefault.jpg",
      publishedAt: "2026-03-30T08:00:00Z",
      tags: ["live", "worship"],
      sortOrder: 2,
      published: true,
    },
    {
      videoId: "ku7Q_KH8YmU",
      title: "With My beautiful people in Kenya celebrating the Palm Sunday",
      description: "Fr. Yesudas celebrates Palm Sunday with the community in Kenya.",
      thumbnailUrl: "https://i.ytimg.com/vi/ku7Q_KH8YmU/hqdefault.jpg",
      publishedAt: "2026-03-29T08:00:00Z",
      tags: ["Palm Sunday", "Kenya", "celebration"],
      sortOrder: 3,
      published: true,
    },
    {
      videoId: "nJzY8I5-jF8",
      title: "Fr.Yesudas Ministries Live",
      description: "Live worship and teaching from Fr. Yesudas Ministries.",
      thumbnailUrl: "https://i.ytimg.com/vi/nJzY8I5-jF8/hqdefault.jpg",
      publishedAt: "2026-03-29T06:00:00Z",
      tags: ["live", "worship"],
      sortOrder: 4,
      published: true,
    },
    {
      videoId: "tUrvteRpEVs",
      title: "Fr.Yesudas Ministries Live",
      description: "Live worship and teaching from Fr. Yesudas Ministries.",
      thumbnailUrl: "https://i.ytimg.com/vi/tUrvteRpEVs/hqdefault.jpg",
      publishedAt: "2026-03-28T10:00:00Z",
      tags: ["live", "worship"],
      sortOrder: 5,
      published: true,
    },
    {
      videoId: "4CH8nMkojvY",
      title: "Fr.Yesudas Ministries Live",
      description: "Live worship and teaching from Fr. Yesudas Ministries.",
      thumbnailUrl: "https://i.ytimg.com/vi/4CH8nMkojvY/hqdefault.jpg",
      publishedAt: "2026-03-27T10:00:00Z",
      tags: ["live", "worship"],
      sortOrder: 6,
      published: true,
    },
    {
      videoId: "qw3QORBMKaQ",
      title: "Fr.Yesudas Ministries Live",
      description: "Live worship and teaching from Fr. Yesudas Ministries.",
      thumbnailUrl: "https://i.ytimg.com/vi/qw3QORBMKaQ/hqdefault.jpg",
      publishedAt: "2026-03-26T10:00:00Z",
      tags: ["live", "worship"],
      sortOrder: 7,
      published: true,
    },
    {
      videoId: "BjLrjF8oTyg",
      title: "Fr.Yesudas Ministries Live",
      description: "Live worship and teaching from Fr. Yesudas Ministries.",
      thumbnailUrl: "https://i.ytimg.com/vi/BjLrjF8oTyg/hqdefault.jpg",
      publishedAt: "2026-03-25T10:00:00Z",
      tags: ["live", "worship"],
      sortOrder: 8,
      published: true,
    },
  ];

  await prisma.sermon.deleteMany({});
  await prisma.sermon.createMany({ data: sermons });
  console.log("✓ Sermons seeded:", sermons.length);

  // Events
  const events = [
    {
      title: "Sunday Worship Service",
      description: "Join us every Sunday for spirit-filled worship, Scripture readings, and a message from Fr. Yesudas. All are welcome.",
      date: "2026-04-06",
      time: "9:00 AM",
      endTime: "11:00 AM",
      location: "Main Sanctuary",
      type: "sunday-service",
      isRecurring: true,
    },
    {
      title: "Good Friday Service",
      description: "A solemn service of reflection and worship commemorating the crucifixion of Jesus Christ.",
      date: "2026-04-03",
      time: "6:00 PM",
      endTime: "8:00 PM",
      location: "Main Sanctuary",
      type: "special",
    },
    {
      title: "Easter Sunday Celebration",
      description: "Celebrate the Resurrection of Jesus Christ! Special worship, testimonies, and a festive message. Invite friends and family.",
      date: "2026-04-05",
      time: "8:00 AM",
      endTime: "10:30 AM",
      location: "Main Sanctuary",
      type: "special",
    },
    {
      title: "Wednesday Prayer Night",
      description: "Midweek prayer gathering — intercession, worship, and studying the Word together.",
      date: "2026-04-08",
      time: "7:00 PM",
      endTime: "9:00 PM",
      location: "Prayer Hall",
      type: "prayer",
      isRecurring: true,
    },
    {
      title: "Youth Retreat 2026",
      description: "A two-day retreat for young people aged 13-30, focused on identity in Christ and calling.",
      date: "2026-04-18",
      time: "8:00 AM",
      location: "Retreat Center, Vizag",
      type: "retreat",
      registrationUrl: "#",
    },
    {
      title: "Community Outreach Day",
      description: "Join us as we serve the local community with food distribution, medical camps, and the love of Christ.",
      date: "2026-04-25",
      time: "9:00 AM",
      endTime: "4:00 PM",
      location: "Community Hall",
      type: "community",
    },
  ];

  await prisma.churchEvent.deleteMany({});
  await prisma.churchEvent.createMany({ data: events });
  console.log("✓ Events seeded:", events.length);

  // Ministries
  const ministries = [
    {
      name: "Worship Ministry",
      description: "Leading the congregation in Spirit-filled worship through music, prayer, and praise.",
      fullDescription: "Our Worship Ministry exists to create an atmosphere where people encounter the living God through music and praise.",
      imageUrl: "/images/ministries/worship.jpg",
      leader: "Bro. Samuel John",
      schedule: "Sundays 8:00 AM & Wednesdays 6:30 PM",
      tags: ["music", "praise", "prayer"],
    },
    {
      name: "Youth Ministry",
      description: "Discipling the next generation in faith, character, and purpose for God's Kingdom.",
      fullDescription: "Youth Ministry invests in young people aged 13–30, helping them discover their identity in Christ.",
      imageUrl: "/images/ministries/youth.jpg",
      leader: "Sis. Priya Thomas",
      schedule: "Saturdays 5:00 PM",
      tags: ["youth", "discipleship", "leadership"],
    },
    {
      name: "Prayer Ministry",
      description: "Interceding for individuals, families, the church, and the nation through fervent prayer.",
      fullDescription: "Our Prayer Ministry is the backbone of the church — a dedicated team of intercessors who stand in the gap for every need.",
      imageUrl: "/images/ministries/prayer.jpg",
      leader: "Sis. Mary Esther",
      schedule: "Wednesdays 7:00 PM & Fridays 6:00 AM",
      tags: ["intercession", "prayer", "spiritual warfare"],
    },
    {
      name: "Outreach & Compassion",
      description: "Serving the poor, the sick, and the marginalized with the compassion of Christ.",
      fullDescription: "The Outreach Ministry takes the Gospel beyond the church walls — through hospital visits, orphan care, food distribution, and community development.",
      imageUrl: "/images/ministries/outreach.jpg",
      leader: "Bro. Paul David",
      schedule: "Last Saturday of every month",
      tags: ["missions", "compassion", "community"],
    },
    {
      name: "Children's Ministry",
      description: "Planting seeds of faith in children through Bible stories, worship, and creative learning.",
      fullDescription: "We believe that children can have a genuine, living faith. Our Children's Ministry creates a fun and safe environment for kids from 3 to 12 years.",
      imageUrl: "/images/ministries/children.jpg",
      leader: "Sis. Ruth Joy",
      schedule: "Sundays during main service",
      tags: ["children", "education", "fun"],
    },
  ];

  await prisma.ministry.deleteMany({});
  await prisma.ministry.createMany({ data: ministries });
  console.log("✓ Ministries seeded:", ministries.length);

  // Team members
  const teamMembers = [
    {
      name: "Fr. Yesudas",
      role: "Founder & Senior Pastor",
      bio: "Fr. Yesudas has been in ministry for over 25 years, with a calling to bring the Gospel to the unreached. He is known for his powerful teaching, healing ministry, and deep compassion for the lost.",
      imageUrl: "/images/team/fr-yesudas.jpg",
      sortOrder: 1,
    },
    {
      name: "Sr. Leela Yesudas",
      role: "Co-Pastor & Women's Ministry Leader",
      bio: "Sr. Leela leads the women's ministry with grace and wisdom, discipling women in faith, family, and purpose. She is a gifted teacher and counselor.",
      imageUrl: "/images/team/sr-leela.jpg",
      sortOrder: 2,
    },
    {
      name: "Bro. Samuel John",
      role: "Worship Director",
      bio: "Samuel leads the church in worship with excellence and authenticity, creating an atmosphere where hearts are opened to the presence of God.",
      imageUrl: "/images/team/samuel.jpg",
      sortOrder: 3,
    },
    {
      name: "Bro. Paul David",
      role: "Outreach Coordinator",
      bio: "Paul coordinates all outreach and compassion efforts of the ministry, overseeing programs that serve thousands in need across the region.",
      imageUrl: "/images/team/paul.jpg",
      sortOrder: 4,
    },
  ];

  await prisma.teamMember.deleteMany({});
  await prisma.teamMember.createMany({ data: teamMembers });
  console.log("✓ Team members seeded:", teamMembers.length);

  console.log("\n✅ Database seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
