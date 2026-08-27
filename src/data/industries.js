// -----------------------------------------------------------------------------
// Data model:
//   - Each industry has TWO independent challenges.
//   - Each challenge has:
//       problem: string   (short 1-2 line problem statement shown on the card)
//       cards:   5 items in this exact order:
//         1. What this means
//         2. Personlyze Intervention
//         3. Video
//         4. Why this works
//         5. Expected Outcome
// -----------------------------------------------------------------------------
import realEstateImg from "../assets/real-estateimg.webp";
import bfsiImg from "../assets/bfsi-img.webp";
import travelImg from "../assets/travelimg.webp";
import healthImg from "../assets/healthimg.webp";
import retailImg from "../assets/Retailimg.webp";
import automotiveImg from "../assets/automotiveimg.webp";
import b2bImg from "../assets/b2bimg.webp";
import fashionImg from "../assets/fashionimg.webp";
import internalCommsImg from "../assets/internal-commsimg.webp";
import govtPoliticsImg from "../assets/govt-politics.webp";
const industries = [
  /* ========================================================================
   * REAL ESTATE
   * ====================================================================== */
  {
    slug: "real-estate",
    name: "Real Estate",
    image: realEstateImg,
    className: "real-estate",
    heroTitle: "Real Estate",
    heroDescription:
      "AI-driven engagement for developers and brokers — turning cold leads into site visits, and site visits into signed bookings.",
    challenges: [
      {
        problem: "Single-digit lead-to-site-visit conversion from digital ads.",
        cards: [
          {
            title: "What this means",
            content:
              "Real estate brands spend crores on Meta and Google, yet the average lead-to-site-visit conversion sits at 2–4%. Every lead gets the same generic brochure and a follow-up call that arrives 24 hours too late, by which time the prospect has already visited competitor sites.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "Trigger a personalised WhatsApp video within 5 minutes of form fill, featuring the prospect's name, the specific locality they enquired about, and a unit type matched to their stated budget.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "Generic follow-up treats every buyer the same. Personalisation creates immediate emotional relevance, so the prospect feels this message was made for them, not blasted to a list.",
          },
          {
            title: "Expected Outcome",
            content:
              "Lead-to-site-visit conversion up to 8–12%, response rate to follow-up up over 60%, and time-to-first-meaningful-engagement down from 24 hours to under 10 minutes.",
          },
        ],
      },
      {
        problem: "Speed-to-lead failure lets competitors call first.",
        cards: [
          {
            title: "What this means",
            content:
              "The average Indian real estate brand takes 18–36 hours to meaningfully follow up on a digital lead. In that window, the prospect has already spoken to two or three competitors.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "Deploy an automated personalised video on WhatsApp within 2–5 minutes of form submission, referencing the prospect's name, the project, and the specific configuration they showed interest in.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "A personalised video that arrives within minutes, naming the prospect's exact interest, creates a moment of recognition that no generic IVR or bulk SMS can replicate.",
          },
          {
            title: "Expected Outcome",
            content:
              "Speed-to-first-engagement down from 18–36 hours to under 5 minutes, lead-to-appointment conversion up 45%, and competitive win rate at top-of-funnel up 30%.",
          },
        ],
      },
      
      
      
    ],
  },
  /* ========================================================================
   * BFSI
   * ====================================================================== */
  {
    slug: "bfsi",
    name: "BFSI",
    image: bfsiImg,
    className: "bfsi",
    heroTitle: "BFSI",
    heroDescription:
      "AI-led engagement for banks, NBFCs and insurers — turning loan and policy enquiries into disbursed, retained customers.",
    challenges: [
      {
        problem: "KYC and onboarding drop-off is massive, especially digital-first.",
        cards: [
          {
            title: "What this means",
            content:
              "Digital-first BFSI onboarding — KYC completion, account activation, first transaction — sees drop-off rates of 40–60% in India. The process is confusing, clinical, and lacks a human touchpoint to guide a hesitant customer through the steps.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "Replace generic onboarding emails with a personalised step-by-step WhatsApp video series, each video addressing the next action the customer needs to take, in their language, at their pace.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "A personalised video that names the exact pending step feels like personal coaching. Drop-off happens at the point of confusion, and personalisation removes that confusion.",
          },
          {
            title: "Expected Outcome",
            content:
              "KYC completion rate up 45%, onboarding drop-off down 50%, and first-transaction activation within 7 days up 38%.",
          },
        ],
      },
      {
        problem: "Policy, SIP and loan renewals are approached too late — competitors swoop in.",
        cards: [
          {
            title: "What this means",
            content:
              "Insurance renewals, SIP continuations and loan top-up windows are consistently missed because brands reach out too late, often just 7–14 days before expiry, giving competitors time to approach first with a better offer.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "Begin a personalised renewal conversation 90 days before the renewal date, with a video that celebrates the customer's journey, quantifies the value delivered, and frames renewal as the logical next chapter.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "A late reminder invites price comparison. An early, personalised value story creates emotional continuity that competitors cannot easily disrupt.",
          },
          {
            title: "Expected Outcome",
            content:
              "Renewal conversion at 90-day outreach up 65% versus a 7-day reminder, competitor switch rate at renewal down 40%, and customer lifetime value at 5 years up 30%.",
          },
        ],
      },
    ],
  },
  /* ========================================================================
   * TRAVEL & HOSPITALITY
   * ====================================================================== */
  {
    slug: "travel",
    name: "Travel & Hospitality",
    image: travelImg,
    className: "travel",
    heroTitle: "Travel & Hospitality",
    heroDescription:
      "AI-powered guest engagement that turns browsers into bookers, and bookers into repeat guests.",
    challenges: [
      {
        problem: "OTA competition erodes direct bookings with better personalisation.",
        cards: [
          {
            title: "What this means",
            content:
              "Hotels and travel brands lose 15–25% of their revenue to OTA commissions, largely because OTAs remember a guest's last trip and preferences while the brand's own website treats every visitor as a stranger.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "Use past guest data and browsing behaviour to trigger personalised direct-booking video outreach, referencing the guest's last stay and offering something exclusive to direct bookings.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "A personalised video referencing a guest's name and last stay creates a direct emotional connection that no aggregator platform can replicate.",
          },
          {
            title: "Expected Outcome",
            content:
              "Direct booking conversion versus OTA referral up 40%, OTA commission savings of 15–22% of revenue, and repeat guest rate up 35%.",
          },
        ],
      },
      {
        problem: "Ancillary revenue like spa, dining and transfers is captured too late.",
        cards: [
          {
            title: "What this means",
            content:
              "Hotel and resort ancillary revenue is almost entirely captured at check-in, when the guest is already in decision-fatigue mode. The pre-arrival window, when excitement is highest, is largely wasted.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "Send a personalised pre-arrival video 3–5 days before check-in, featuring add-ons curated for the guest's travel profile, whether couple, family or solo traveller.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "A personalised offer tied to a specific occasion, with visible scarcity, creates urgency and relevance that a generic upgrade email cannot.",
          },
          {
            title: "Expected Outcome",
            content:
              "Pre-arrival ancillary revenue per booking up 65%, spa and dining upsell conversion up 45%, and total revenue per guest up 20%.",
          },
        ],
      },
    ],
  },
  /* ========================================================================
   * HEALTH & WELLNESS
   * ====================================================================== */
  {
    slug: "health",
    name: "Health & Wellness",
    image: healthImg,
    className: "health",
    heroTitle: "Health & Wellness",
    heroDescription:
      "AI-driven patient engagement that improves appointment adherence, reduces no-shows, and keeps patients on their care path.",
    challenges: [
      {
        problem: "Patient adherence drops sharply after the first purchase.",
        cards: [
          {
            title: "What this means",
            content:
              "Across pharma and wellness categories, 40–60% of patients stop taking a prescribed or purchased treatment within the first 30 days, not because the product stops working, but because the brand stops communicating meaningfully after the first transaction.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "Deploy a personalised adherence video series at Day 3, 7, 14 and 30, each one acknowledging where the patient is in their journey and what to expect next, delivered on WhatsApp in their preferred language.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "A personalised video that names the patient's exact stage creates a sense of guided progression, making patients feel they're on a journey with a companion, not taking a product alone.",
          },
          {
            title: "Expected Outcome",
            content:
              "30-day adherence rate up 45%, second-purchase or refill rate up 38%, and brand NPS among adherent patients up 25 points.",
          },
        ],
      },
      {
        problem: "Prescription refill rates are low — patients switch brands or skip doses.",
        cards: [
          {
            title: "What this means",
            content:
              "Generic refill reminders such as SMS blasts and app notifications have very low open and action rates, resulting in patients who run out of medication, skip doses, or switch brands at the pharmacy.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "Trigger a personalised refill video at the predicted Day 22–25 of a 30-day supply, with a direct reorder link and a brief message that references the patient's progress.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "A personalised message that celebrates consistency and removes friction makes the refill feel like a natural next step rather than another ignored notification.",
          },
          {
            title: "Expected Outcome",
            content:
              "Refill rate at Day 25 up 50%, brand loyalty at the 6-month mark up 35%, and patient lifetime value up 40%.",
          },
        ],
      },
    ],
  },
  /* ========================================================================
   * RETAIL & D2C
   * ====================================================================== */
  {
    slug: "retail",
    name: "Retail & D2C",
    image: retailImg,
    className: "retail",
    heroTitle: "Retail & D2C",
    heroDescription:
      "AI-powered commerce engagement that recovers lost carts, personalises offers, and turns one-time buyers into repeat customers.",
    challenges: [
      {
        problem: "Cart abandonment sits above 70% — the biggest revenue leak in ecommerce.",
        cards: [
          {
            title: "What this means",
            content:
              "An average of 70–75% of ecommerce carts are abandoned before checkout. Brands respond with generic discount emails sent 24 hours later, by which time the impulse that drove the browsing session has evaporated.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "Trigger a personalised WhatsApp video within 20–30 minutes of abandonment, featuring the exact product left in cart and a time-sensitive, value-led reason to return that isn't just a coupon.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "A personalised message that explains why a product genuinely fits the shopper creates a reason to return based on value, not discount, protecting margin.",
          },
          {
            title: "Expected Outcome",
            content:
              "Cart recovery rate up from 3–5% to 12–18%, revenue recovered per 1,000 abandoned carts up 3x, and discount dependency in recovery down 40%.",
          },
        ],
      },
      {
        problem: "First purchase doesn't convert to a second — lifetime value never builds.",
        cards: [
          {
            title: "What this means",
            content:
              "The most expensive customer in ecommerce is the one who buys once and never returns, yet most D2C brands invest almost nothing in the 48-hour post-purchase window when customers are most emotionally connected to the brand.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "Send a personalised 'what to try next' video within 48 hours of delivery, based on exactly what the customer bought, their browsing history and their profile, framed as a genuine recommendation.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "A recommendation that explains specifically why the next product fits creates a human connection that an algorithmic 'you might also like' grid cannot.",
          },
          {
            title: "Expected Outcome",
            content:
              "First-to-second purchase conversion up from 15% to 35%, 90-day LTV up 55%, and open rate on post-purchase personalised video up 4x versus generic.",
          },
        ],
      },
    ],
  },
  /* ========================================================================
   * AUTOMOTIVE
   * ====================================================================== */
  {
    slug: "automotive",
    name: "Automotive",
    image: automotiveImg,
    className: "automotive",
    heroTitle: "Automotive",
    heroDescription:
      "AI-driven engagement for dealerships and service centers — from first enquiry to test drive to lifetime service retention.",
    challenges: [
      {
        problem: "Showroom walk-ins are declining, and digital leads convert slowly.",
        cards: [
          {
            title: "What this means",
            content:
              "Automotive showroom walk-ins have declined 30–40% since 2019, shifting consideration online. Yet most dealerships follow up on digital leads with a call from an unknown number, 24–48 hours later, referencing nothing the prospect actually looked at.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "Trigger a personalised video on WhatsApp within 5 minutes of a test drive enquiry or configurator submission, featuring the exact model, colour and variant the prospect configured.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "A personalised video that arrives fast and names the prospect's exact chosen model is the difference between a lead and a conversation — the dealer who feels most personal wins, not just whoever calls first.",
          },
          {
            title: "Expected Outcome",
            content:
              "Digital lead-to-test-drive conversion up 50%, time-to-engagement down from 36 hours to under 10 minutes, and competitive conquest rate at test drive stage up 35%.",
          },
        ],
      },
      {
        problem: "First service visits are missed, and customers go to local garages instead.",
        cards: [
          {
            title: "What this means",
            content:
              "An estimated 35–45% of new car owners miss their first scheduled service, choosing independent garages instead, primarily because the brand's service reminder is generic and easy to ignore.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "Trigger a personalised service reminder video at the exact mileage or time threshold, referencing the customer's name, model and registration number, two weeks before service is due.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "A personalised reminder that explains exactly what will be checked and how the car will feel afterward creates a reason to come in that a local garage simply cannot match.",
          },
          {
            title: "Expected Outcome",
            content:
              "First service visit rate at authorised centres up 40%, annual service revenue retention up 35%, and service satisfaction score up 22 points.",
          },
        ],
      },
    ],
  },
  /* ========================================================================
   * B2B & SAAS
   * ====================================================================== */
  {
    slug: "b2b",
    name: "B2B & SaaS",
    image: b2bImg,
    className: "saas",
    heroTitle: "B2B & SaaS",
    heroDescription:
      "AI-driven engagement across the funnel — from demo request to trial activation to expansion revenue.",
    challenges: [
      {
        problem: "Cold outreach via email and LinkedIn has sub-2% response rates.",
        cards: [
          {
            title: "What this means",
            content:
              "B2B sales teams send thousands of cold emails and LinkedIn messages monthly and get responses from fewer than 2% of recipients, because the message is generic — the same pitch sent to every prospect regardless of who they are.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "Replace text-based cold outreach with a personalised 60-second video featuring the prospect's name, their company, and a specific observation about their current challenge, delivered via LinkedIn DM or WhatsApp.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "A personalised video that shows clear homework on the prospect's specific situation creates a 'they actually looked me up' moment that stops the scroll and invites a response.",
          },
          {
            title: "Expected Outcome",
            content:
              "Cold outreach response rate up from under 2% to 12–18%, meeting booking rate up 4x versus text email, and sales cycle length down 25%.",
          },
        ],
      },
      {
        problem: "SaaS onboarding completion is low, and customers churn before getting value.",
        cards: [
          {
            title: "What this means",
            content:
              "SaaS products see 40–60% of new customers never complete onboarding — they sign up, get confused or overwhelmed, and quietly stop logging in, often before the CSM even notices.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "Deploy a role-based personalised onboarding video series, triggered by actual in-product behaviour, where each role — admin, end user, decision-maker — gets content matched to their specific moment in the journey.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "A video that names the exact step a user stalled at removes friction at the precise point it occurs, rather than treating every user identically.",
          },
          {
            title: "Expected Outcome",
            content:
              "Onboarding completion rate up 50%, time-to-first-value down from 21 days to 7 days, and 90-day churn rate down 40%.",
          },
        ],
      },
    ],
  },
  /* ========================================================================
   * FASHION & LIFESTYLE
   * ====================================================================== */
  {
    slug: "fashion",
    name: "Fashion & Lifestyle",
    image: fashionImg,
    className: "fashion",
    heroTitle: "Fashion & Lifestyle",
    heroDescription:
      "AI-powered styling and engagement that turns browsers into buyers and one-time purchases into a wardrobe relationship.",
    challenges: [
      {
        problem: "First purchase doesn't lead to a second — the brand is forgotten between seasons.",
        cards: [
          {
            title: "What this means",
            content:
              "Fashion brands invest heavily in acquiring first-time buyers but see only 15–20% convert to a second purchase, because the two-week post-delivery window, when customers are most open to the brand, is largely ignored.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "Send a personalised 'style continuation' video 10–14 days after delivery, suggesting how to wear the piece for an upcoming occasion and extending the conversation forward.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "Continuing the style conversation, rather than just requesting a review, builds the habit of looking to the brand for guidance, which is the foundation of fashion loyalty.",
          },
          {
            title: "Expected Outcome",
            content:
              "First-to-second purchase conversion up from 18% to 38%, brand engagement in the 30-day post-purchase window up 60%, and customer LTV at 12 months up 50%.",
          },
        ],
      },
      {
        problem: "Browse-to-buy conversion is very low — customers look but don't commit.",
        cards: [
          {
            title: "What this means",
            content:
              "Fashion ecommerce browse-to-buy conversion averages just 1–3%. Customers add items to wishlists and leave without purchasing, not because they didn't want the product, but because nothing nudged them to commit at the right moment.",
          },
          {
            title: "Personlyze Intervention",
            content:
              "Trigger a personalised video within 30 minutes of a wishlist add or extended browse, styled for the customer's size and occasion signals, delivered on WhatsApp to feel like a friend's recommendation.",
          },
          { title: "Video" },
          {
            title: "Why this works",
            content:
              "A video that styles the saved item in multiple ways for the customer's specific look creates curiosity and a concrete reason to click through, unlike a repeat retargeting ad.",
          },
          {
            title: "Expected Outcome",
            content:
              "Wishlist-to-purchase conversion up from 4% to 14%, average session-to-sale time down 35%, and return rate on personalised-recommendation purchases down 20%.",
          },
        ],
      },
    ],
  },
  /* ========================================================================
 * INTERNAL COMMUNICATION
 * ====================================================================== */
{
  slug: "internal-communication",
  name: "Internal Communication",
  image: internalCommsImg,
  className: "internal-communication",
  heroTitle: "Internal Communication",
  heroDescription:
    "AI-powered employee engagement that keeps teams informed, aligned, and connected through personalized internal communication.",

  challenges: [
    {
      problem: "Employees ignore important internal announcements and company updates.",
      cards: [
        {
          title: "What this means",
          content:
            "Emails and intranet announcements often get overlooked, causing employees to miss important updates, policy changes, and organizational news.",
        },
        {
          title: "Personlyze Intervention",
          content:
            "Deliver personalized WhatsApp and video messages based on department, role, and location so every employee receives relevant information at the right time.",
        },
        { title: "Video" },
        {
          title: "Why this works",
          content:
            "Personalized communication feels relevant and increases attention, ensuring employees engage with information that directly impacts them.",
        },
        {
          title: "Expected Outcome",
          content:
            "Higher announcement engagement, improved communication effectiveness, and better employee awareness across the organization.",
        },
      ],
    },
    {
      problem: "Low participation in company initiatives, training, and internal events.",
      cards: [
        {
          title: "What this means",
          content:
            "Training programs, wellness initiatives, surveys, and company events often receive low participation because communication is generic and untimely.",
        },
        {
          title: "Personlyze Intervention",
          content:
            "Send personalized invitation videos and timely reminders tailored to each employee's role, interests, and previous participation.",
        },
        { title: "Video" },
        {
          title: "Why this works",
          content:
            "Relevant and personalized invitations create stronger engagement, making employees more likely to participate in organizational activities.",
        },
        {
          title: "Expected Outcome",
          content:
            "Higher participation rates, increased training completion, stronger employee engagement, and improved internal communication metrics.",
        },
      ],
    },
  ],
},
  {
  slug: "govt-politics",
  name: "Govt & Politics",
  image: govtPoliticsImg,// replace with your actual image later
  className: "govt-politics",
  heroTitle: "Govt & Politics",
  heroDescription:
    "AI-powered citizen engagement and personalized public communication for government organizations.",

  challenges: [
    {
      problem: "Citizens often miss important government announcements and schemes.",
      cards: [
        {
          title: "What this means",
          content:
            "Generic communication fails to reach the right citizens at the right time.",
        },
        {
          title: "Personlyze Intervention",
          content:
            "Deliver personalized WhatsApp videos based on citizen profile, language and location.",
        },
        { title: "Video" },
        {
          title: "Why this works",
          content:
            "Personalized communication increases trust, engagement and awareness.",
        },
        {
          title: "Expected Outcome",
          content:
            "Higher citizen engagement, improved awareness and faster response rates.",
        },
      ],
    },
    {
      problem: "Government campaigns struggle to achieve high participation.",
      cards: [
        {
          title: "What this means",
          content:
            "Mass campaigns often receive low engagement because messaging is generic.",
        },
        {
          title: "Personlyze Intervention",
          content:
            "Send personalized campaign videos based on citizen interests and demographics.",
        },
        { title: "Video" },
        {
          title: "Why this works",
          content:
            "Relevant messaging encourages participation and builds public trust.",
        },
        {
          title: "Expected Outcome",
          content:
            "Better campaign participation and stronger citizen interaction.",
        },
      ],
    },
  ],
},
];

export default industries;