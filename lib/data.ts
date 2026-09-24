const t = (m: number) => new Date(Date.now() - m * 60000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
export const now = () => t(0);
export const faculty = [
 ["F101","Dr. Meera Krishnan","Information Technology","In Class","2nd Floor – Room 204","11:30 AM – Staff Room","Data Structures"],
 ["F102","Prof. Arun Prakash","Computer Science","Available","IT Block – Staff Room 3","Now","Algorithms"],
 ["F103","Dr. Lakshmi Narayanan","Electronics","In Lab","ECE Lab 2","1:00 PM – Staff Room","VLSI Design"],
 ["F104","Prof. Suresh Babu","Mechanical","On Leave","—","Tomorrow 9:00 AM","Thermodynamics"],
 ["F105","Dr. Anitha Rajan","Information Technology","Available Soon","3rd Floor – Room 310","10:45 AM – Staff Room","Machine Learning"],
 ["F106","Prof. Karthik Vel","Civil","In Class","Block C – Room 118","12:15 PM – Staff Room","Structural Analysis"],
 ["F107","Dr. Priya Subramanian","Mathematics","Available","Main Block – Staff Room 1","Now","Discrete Maths"],
 ["F108","Prof. Vignesh Kumar","Computer Science","In Meeting","Principal's Office","2:00 PM – Staff Room","Operating Systems"],
 ["F109","Dr. Farah Sheikh","Electrical","Available","EEE Block – Room 12","Now","Power Systems"],
 ["F110","Prof. Rajesh Menon","Information Technology","In Lab","IT Lab 1","11:30 AM – Staff Room","Web Technologies"],
].map(([id,name,dept,status,loc,next,subject])=>({id,name,dept,status,loc,next,subject}));
export const clubs = [
 ["c1","AI Club","Technical","🤖","Build, learn and ship machine-learning projects.","Dr. Anitha Rajan"],
 ["c2","Coding Club","Technical","💻","Weekly contests, DSA circles and hackathons.","Prof. Arun Prakash"],
 ["c3","Robotics Club","Technical","🦾","Autonomous bots and embedded systems.","Dr. Lakshmi Narayanan"],
 ["c4","Cultural Club","Cultural","🎭","Dance, music and drama across the year.","Dr. Priya Subramanian"],
 ["c5","Literary Club","Literary","📚","Debates, poetry slams and quizzes.","Dr. Farah Sheikh"],
 ["c6","Photography Club","Arts","📷","Photo walks and campus exhibitions.","Prof. Karthik Vel"],
 ["c7","E-Cell","Entrepreneurship","🚀","Startup pitches and founder talks.","Prof. Vignesh Kumar"],
 ["c8","Sports Club","Sports","🏏","Inter-department tournaments.","Prof. Suresh Babu"],
 ["c9","Social Service Club","Social","🤝","Blood drives and community outreach.","Dr. Meera Krishnan"],
 ["c10","IT Department Club","Department","🧩","Peer learning for IT students.","Prof. Rajesh Menon"],
].map(([id,name,cat,icon,about,coord])=>({id,name,cat,icon,about,coord}));
export const events = [
 {id:"e1",title:"AI Workshop",club:"AI Club",clubId:"c1",type:"Workshop",date:"28 Sep",time:"10:00 AM",venue:"Seminar Hall",deadline:"26 Sep",seats:40,dept:"IT"},
 {id:"e2",title:"CodeStorm Hackathon",club:"Coding Club",clubId:"c2",type:"Hackathon",date:"03 Oct",time:"9:00 AM",venue:"IT Lab 1",deadline:"30 Sep",seats:12,dept:"IT"},
 {id:"e3",title:"Inter-Dept Debate",club:"Literary Club",clubId:"c5",type:"Debate",date:"05 Oct",time:"2:00 PM",venue:"Auditorium",deadline:"02 Oct",seats:60,dept:"All"},
 {id:"e4",title:"Line Follower Challenge",club:"Robotics Club",clubId:"c3",type:"Competition",date:"09 Oct",time:"11:00 AM",venue:"ECE Lab 2",deadline:"06 Oct",seats:5,dept:"ECE"},
 {id:"e5",title:"Founders Talk",club:"E-Cell",clubId:"c7",type:"Guest Lecture",date:"12 Oct",time:"3:00 PM",venue:"Seminar Hall",deadline:"10 Oct",seats:120,dept:"All"},
 {id:"e6",title:"Campus Photo Walk",club:"Photography Club",clubId:"c6",type:"Cultural Event",date:"15 Oct",time:"7:00 AM",venue:"Main Gate",deadline:"13 Oct",seats:30,dept:"All"},
];
export const water = [
 ["w1","Block A","Can A-01",80,"Available"],["w2","Block A","Can A-02",30,"Low"],["w3","Block B","Can B-01",5,"Empty"],
 ["w4","Block C","Can C-01",95,"Available"],["w5","Library","Can L-01",60,"Available"],["w6","Canteen","Can K-01",10,"Empty"],
].map(([id,block,can,level,_s],i)=>({id,block,can,level:level as number,requested:false,refill:t(120+i*20),updated:t(i*3+1)}));
export const restrooms = [
 {id:"r1",name:"Restroom A – Ground",water:"Available",clean:"Good",maint:"Normal",inspected:t(45)},
 {id:"r2",name:"Restroom A – 1st Floor",water:"Low",clean:"Fair",maint:"Normal",inspected:t(90)},
 {id:"r3",name:"Restroom B – Ground",water:"Unavailable",clean:"Needs Cleaning",maint:"Issue Reported",inspected:t(200)},
 {id:"r4",name:"Restroom C – 2nd Floor",water:"Available",clean:"Good",maint:"Normal",inspected:t(30)},
];
export const complaints = [
 {id:"SC-2041",cat:"Wi-Fi",loc:"Block B – 204",desc:"Wi-Fi drops every few minutes.",status:"In Progress",by:"Ananya R.",date:"22 Sep",assignee:"IT Support"},
 {id:"SC-2042",cat:"Drinking Water",loc:"Canteen",desc:"Water can empty since morning.",status:"Assigned",by:"Rahul S.",date:"24 Sep",assignee:"Maintenance"},
 {id:"SC-2043",cat:"Electricity",loc:"Lab 3",desc:"Two sockets not working.",status:"Submitted",by:"Divya M.",date:"24 Sep",assignee:"—"},
 {id:"SC-2039",cat:"Furniture",loc:"Block A – 101",desc:"Broken bench.",status:"Resolved",by:"Karan P.",date:"19 Sep",assignee:"Maintenance"},
];
export const fees = { semester:"Semester 5", total:85000, paid:60000, due:"15 Oct 2026",
 history:[["TXN-88121","Tuition – Instalment 1","₹40,000","02 Aug"],["TXN-88790","Lab & Library","₹20,000","20 Aug"]] };
export const announcements = [
 {id:1,cat:"Exam",title:"Internal Assessment 2 schedule released",time:"2h ago",important:true},
 {id:2,cat:"Placement",title:"TCS campus drive on 10 October",time:"Yesterday",important:false},
 {id:3,cat:"Holiday",title:"College closed on 02 October",time:"2 days ago",important:false},
];
export const notifications = [
 {id:1,type:"Clubs",icon:"🔔",title:"New club activity: AI Workshop",body:"28 Sep · 10:00 AM · Seminar Hall",time:"10m",read:false,ref:"e1"},
 {id:2,type:"Campus Issues",icon:"📝",title:"SC-2041 moved to In Progress",body:"IT Support is working on it.",time:"1h",read:false},
 {id:3,type:"Fees",icon:"💰",title:"Fee reminder",body:"₹25,000 due on 15 Oct.",time:"3h",read:false},
 {id:4,type:"Academic",icon:"📢",title:"Internal Assessment 2 schedule",body:"View the timetable on Announcements.",time:"5h",read:true},
 {id:5,type:"Emergency",icon:"🚨",title:"Power maintenance 2–3 PM, Block C",body:"Save your work in labs.",time:"1d",read:true},
];
export const timetable = [
 ["9:00","Data Structures","Dr. Meera Krishnan","Room 204"],["10:00","Machine Learning","Dr. Anitha Rajan","Room 310"],
 ["11:00","Web Technologies Lab","Prof. Rajesh Menon","IT Lab 1"],["12:00","Discrete Maths","Dr. Priya Subramanian","Room 105"],
 ["2:00","Operating Systems","Prof. Vignesh Kumar","Room 204"],
];
