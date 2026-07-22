import logging
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, Base, engine
from app.core.security import get_password_hash
from app.models.all_models import Company, Department, Role, User, Parameter, Evaluation, DimensionScore, EvaluationStatus

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("seed")

def seed_db(db: Session):
    logger.info("Dropping existing tables...")
    Base.metadata.drop_all(bind=engine)
    logger.info("Creating new database tables...")
    Base.metadata.create_all(bind=engine)

    # 1. Roles
    logger.info("Seeding roles...")
    r_employee = Role(name="employee")
    r_manager = Role(name="manager")
    r_hr = Role(name="hr")
    r_admin = Role(name="admin")
    db.add_all([r_employee, r_manager, r_hr, r_admin])
    db.flush()

    # 2. Companies
    logger.info("Seeding companies...")
    c_ashoka = Company(
        id="ashoka",
        name="Ashoka Textiles",
        theme="theme-ashoka",
        logo="AT",
        tagline="Crafting futures, thread by thread."
    )
    c_bright = Company(
        id="brightpath",
        name="Bright Path Consulting",
        theme="theme-brightpath",
        logo="BP",
        tagline="Clarity in every decision."
    )
    db.add_all([c_ashoka, c_bright])
    db.flush()

    # 3. Parameters
    logger.info("Seeding parameters...")
    p_own = Parameter(
        id="ownership",
        label="Ownership",
        icon_name="Target",
        tip="Mention one specific example. It makes a bigger impact."
    )
    p_comm = Parameter(
        id="communication",
        label="Communication",
        icon_name="MessageSquare",
        tip="Mention one recent meeting or presentation moment."
    )
    p_qual = Parameter(
        id="quality",
        label="Quality of Work",
        icon_name="Zap",
        tip="Highlight one specific deliverable or output they owned."
    )
    p_collab = Parameter(
        id="collaboration",
        label="Collaboration",
        icon_name="Users",
        tip="Think about a moment they actively supported the team."
    )
    p_init = Parameter(
        id="initiative",
        label="Initiative",
        icon_name="Rocket",
        tip="Mention one time they went beyond what was asked of them."
    )
    db.add_all([p_own, p_comm, p_qual, p_collab, p_init])
    db.flush()

    # 4. Departments
    logger.info("Seeding departments...")
    d_design = Department(name="Design", company_id="ashoka")
    d_eng = Department(name="Engineering", company_id="ashoka")
    d_mktg = Department(name="Marketing", company_id="ashoka")
    d_sales = Department(name="Sales", company_id="ashoka")
    d_ops = Department(name="Operations", company_id="ashoka")

    d_strat = Department(name="Strategy", company_id="brightpath")
    d_tech = Department(name="Technology", company_id="brightpath")
    db.add_all([d_design, d_eng, d_mktg, d_sales, d_ops, d_strat, d_tech])
    db.flush()

    # 5. Users
    logger.info("Seeding users...")
    hashed_pwd = get_password_hash("password123")

    # --- ASHOKA TEXTILES HIERARCHY ---
    # Root: COO (Aman Verma)
    u_coo = User(
        id="u_coo",
        company_id="ashoka",
        department_id=d_ops.id,
        name="Aman Verma",
        title="Chief Operating Officer",
        email="coo@ashoka.com",
        hashed_password=hashed_pwd,
        initials="AV",
        manager_id=None,
        join_date="2018-05-10"
    )
    u_coo.roles.extend([r_manager, r_admin])

    # Rohan Menon reports to COO
    u_rohan = User(
        id="u2",
        company_id="ashoka",
        department_id=d_eng.id,
        name="Rohan Menon",
        title="Engineering Lead",
        email="rohan@ashoka.com",
        hashed_password=hashed_pwd,
        initials="RM",
        manager_id="u_coo",
        join_date="2021-03-10"
    )
    u_rohan.roles.extend([r_manager, r_employee])

    # Priya Sharma reports to Rohan
    u_priya = User(
        id="u1",
        company_id="ashoka",
        department_id=d_design.id,
        name="Priya Sharma",
        title="HR & Operations Manager",
        email="priya@ashoka.com",
        hashed_password=hashed_pwd,
        initials="PS",
        manager_id="u2",
        join_date="2020-01-15"
    )
    u_priya.roles.extend([r_manager, r_hr, r_admin, r_employee])

    # 6 Employees report to Priya:
    # 1. Sneha Iyer
    u_sneha = User(
        id="u3",
        company_id="ashoka",
        department_id=d_design.id,
        name="Sneha Iyer",
        title="Design Lead",
        email="sneha@ashoka.com",
        hashed_password=hashed_pwd,
        initials="SI",
        manager_id="u1",
        join_date="2021-06-01"
    )
    u_sneha.roles.extend([r_employee, r_manager])

    # 2. Rahul Verma
    u_rahul = User(
        id="u4",
        company_id="ashoka",
        department_id=d_design.id,
        name="Rahul Verma",
        title="Product Designer",
        email="rahul@ashoka.com",
        hashed_password=hashed_pwd,
        initials="RV",
        manager_id="u1",
        join_date="2022-02-14"
    )
    u_rahul.roles.append(r_employee)

    # 3. Arjun Mehta
    u_arjun = User(
        id="u5",
        company_id="ashoka",
        department_id=d_eng.id,
        name="Arjun Mehta",
        title="Backend Developer",
        email="arjun@ashoka.com",
        hashed_password=hashed_pwd,
        initials="AM",
        manager_id="u1",
        join_date="2022-08-22"
    )
    u_arjun.roles.append(r_employee)

    # 4. Kavita Singh
    u_kavita = User(
        id="u6",
        company_id="ashoka",
        department_id=d_mktg.id,
        name="Kavita Singh",
        title="Marketing Lead",
        email="kavita@ashoka.com",
        hashed_password=hashed_pwd,
        initials="KS",
        manager_id="u1",
        join_date="2021-11-05"
    )
    u_kavita.roles.extend([r_employee, r_manager])

    # 5. Sampath Kumar
    u_sampath = User(
        id="u7",
        company_id="ashoka",
        department_id=d_eng.id,
        name="Sampath Kumar",
        title="Frontend Developer",
        email="sampath@ashoka.com",
        hashed_password=hashed_pwd,
        initials="SK",
        manager_id="u1",
        join_date="2023-01-09"
    )
    u_sampath.roles.append(r_employee)

    # 6. Ananya Rao
    u_ananya = User(
        id="u8",
        company_id="ashoka",
        department_id=d_sales.id,
        name="Ananya Rao",
        title="Sales Executive",
        email="ananya@ashoka.com",
        hashed_password=hashed_pwd,
        initials="AR",
        manager_id="u1",
        join_date="2023-04-17"
    )
    u_ananya.roles.append(r_employee)


    # --- BRIGHT PATH CONSULTING HIERARCHY ---
    # Root: Founder (Vivek Nair)
    u_founder = User(
        id="b1",
        company_id="brightpath",
        department_id=d_strat.id,
        name="Vivek Nair",
        title="Managing Director & Founder",
        email="founder@brightpath.com",
        hashed_password=hashed_pwd,
        initials="VN",
        manager_id=None,
        join_date="2019-06-01"
    )
    u_founder.roles.extend([r_manager, r_hr, r_admin])

    # 8 Employees report directly to Founder:
    # 1. Divya Krishnan
    u_bp_divya = User(
        id="b2",
        company_id="brightpath",
        department_id=d_tech.id,
        name="Divya Krishnan",
        title="Technology Specialist",
        email="divya@brightpath.com",
        hashed_password=hashed_pwd,
        initials="DK",
        manager_id="b1",
        join_date="2020-09-14"
    )
    u_bp_divya.roles.append(r_employee)

    # 2. Amit Patel
    u_bp_amit = User(
        id="b3",
        company_id="brightpath",
        department_id=d_tech.id,
        name="Amit Patel",
        title="Strategy Consultant",
        email="amit@brightpath.com",
        hashed_password=hashed_pwd,
        initials="AP",
        manager_id="b1",
        join_date="2021-02-18"
    )
    u_bp_amit.roles.append(r_employee)

    # 3. Neha Sen
    u_bp_neha = User(
        id="b4",
        company_id="brightpath",
        department_id=d_strat.id,
        name="Neha Sen",
        title="Senior Analyst",
        email="neha@brightpath.com",
        hashed_password=hashed_pwd,
        initials="NS",
        manager_id="b1",
        join_date="2021-08-01"
    )
    u_bp_neha.roles.append(r_employee)

    # 4. Rajesh Kumar
    u_bp_rajesh = User(
        id="b5",
        company_id="brightpath",
        department_id=d_tech.id,
        name="Rajesh Kumar",
        title="IT Advisor",
        email="rajesh@brightpath.com",
        hashed_password=hashed_pwd,
        initials="RK",
        manager_id="b1",
        join_date="2022-01-10"
    )
    u_bp_rajesh.roles.append(r_employee)

    # 5. Shreya Ghoshal
    u_bp_shreya = User(
        id="b6",
        company_id="brightpath",
        department_id=d_strat.id,
        name="Shreya Ghoshal",
        title="Business Consultant",
        email="shreya@brightpath.com",
        hashed_password=hashed_pwd,
        initials="SG",
        manager_id="b1",
        join_date="2022-11-15"
    )
    u_bp_shreya.roles.append(r_employee)

    # 6. Vikram Seth
    u_bp_vikram = User(
        id="b7",
        company_id="brightpath",
        department_id=d_strat.id,
        name="Vikram Seth",
        title="Principal Consultant",
        email="vikram@brightpath.com",
        hashed_password=hashed_pwd,
        initials="VS",
        manager_id="b1",
        join_date="2020-04-05"
    )
    u_bp_vikram.roles.append(r_employee)

    # 7. Pooja Hegde
    u_bp_pooja = User(
        id="b8",
        company_id="brightpath",
        department_id=d_tech.id,
        name="Pooja Hegde",
        title="Operations Analyst",
        email="pooja@brightpath.com",
        hashed_password=hashed_pwd,
        initials="PH",
        manager_id="b1",
        join_date="2023-05-12"
    )
    u_bp_pooja.roles.append(r_employee)

    # 8. Karan Johar
    u_bp_karan = User(
        id="b9",
        company_id="brightpath",
        department_id=d_strat.id,
        name="Karan Johar",
        title="Marketing Coordinator",
        email="karan@brightpath.com",
        hashed_password=hashed_pwd,
        initials="KJ",
        manager_id="b1",
        join_date="2023-09-01"
    )
    u_bp_karan.roles.append(r_employee)

    db.add_all([
        u_coo, u_rohan, u_priya, u_sneha, u_rahul, u_arjun, u_kavita, u_sampath, u_ananya,
        u_founder, u_bp_divya, u_bp_amit, u_bp_neha, u_bp_rajesh, u_bp_shreya, u_bp_vikram, u_bp_pooja, u_bp_karan
    ])
    db.flush()

    # 6. Seed Evaluations
    logger.info("Seeding evaluations...")

    # Rohan's July evaluation of Priya (draft)
    ev_priya_july = Evaluation(
        id="ev_priya_july",
        company_id="ashoka",
        employee_id="u1",
        manager_id="u2",
        month="July",
        year=2024,
        status=EvaluationStatus.draft,
        due_date="2024-07-31"
    )
    db.add(ev_priya_july)
    db.flush()
    db.add_all([
        DimensionScore(evaluation_id=ev_priya_july.id, parameter_id=p_own.id, score=4, comment="Priya shows excellent operations management."),
        DimensionScore(evaluation_id=ev_priya_july.id, parameter_id=p_comm.id, score=0, comment=""),
        DimensionScore(evaluation_id=ev_priya_july.id, parameter_id=p_qual.id, score=0, comment=""),
        DimensionScore(evaluation_id=ev_priya_july.id, parameter_id=p_collab.id, score=0, comment=""),
        DimensionScore(evaluation_id=ev_priya_july.id, parameter_id=p_init.id, score=0, comment="")
    ])

    # Priya's July evaluation of Rahul (draft)
    ev_rahul_july = Evaluation(
        id="ev1",
        company_id="ashoka",
        employee_id="u4",
        manager_id="u1",
        month="July",
        year=2024,
        status=EvaluationStatus.draft,
        due_date="2024-07-31"
    )
    db.add(ev_rahul_july)
    db.flush()
    db.add_all([
        DimensionScore(evaluation_id=ev_rahul_july.id, parameter_id=p_own.id, score=4, comment="Rahul took full ownership of the critical dashboard migration project and proactively resolved deployment blockers."),
        DimensionScore(evaluation_id=ev_rahul_july.id, parameter_id=p_comm.id, score=0, comment=""),
        DimensionScore(evaluation_id=ev_rahul_july.id, parameter_id=p_qual.id, score=0, comment=""),
        DimensionScore(evaluation_id=ev_rahul_july.id, parameter_id=p_collab.id, score=0, comment=""),
        DimensionScore(evaluation_id=ev_rahul_july.id, parameter_id=p_init.id, score=0, comment="")
    ])

    # Priya's past evaluations of Rahul
    ev_rahul_june = Evaluation(
        id="ev2",
        company_id="ashoka",
        employee_id="u4",
        manager_id="u1",
        month="June",
        year=2024,
        status=EvaluationStatus.locked,
        due_date="2024-06-30",
        overall_score=4.0
    )
    db.add(ev_rahul_june)
    db.flush()
    db.add_all([
        DimensionScore(evaluation_id=ev_rahul_june.id, parameter_id=p_own.id, score=4, comment="Rahul took complete charge of the client design handoff and ensured all developer assets were ready on time."),
        DimensionScore(evaluation_id=ev_rahul_june.id, parameter_id=p_comm.id, score=5, comment="Communicates clearly and concisely. Outstanding coordination during our cross-functional alignment sessions."),
        DimensionScore(evaluation_id=ev_rahul_june.id, parameter_id=p_qual.id, score=4, comment="High quality mockups and micro-interactions. The design specs were clean and highly detailed."),
        DimensionScore(evaluation_id=ev_rahul_june.id, parameter_id=p_collab.id, score=4, comment="Collaborated smoothly with the engineering team to resolve layout discrepancies."),
        DimensionScore(evaluation_id=ev_rahul_june.id, parameter_id=p_init.id, score=3, comment="Met expectations. Could proactively introduce creative product feature concepts during planning.")
    ])

    # Priya's July evaluation of Arjun (pending)
    ev_arjun_july = Evaluation(
        id="ev4",
        company_id="ashoka",
        employee_id="u5",
        manager_id="u1",
        month="July",
        year=2024,
        status=EvaluationStatus.pending,
        due_date="2024-07-31"
    )
    db.add(ev_arjun_july)
    db.flush()
    db.add_all([
        DimensionScore(evaluation_id=ev_arjun_july.id, parameter_id=p_own.id, score=0, comment=""),
        DimensionScore(evaluation_id=ev_arjun_july.id, parameter_id=p_comm.id, score=0, comment=""),
        DimensionScore(evaluation_id=ev_arjun_july.id, parameter_id=p_qual.id, score=0, comment=""),
        DimensionScore(evaluation_id=ev_arjun_july.id, parameter_id=p_collab.id, score=0, comment=""),
        DimensionScore(evaluation_id=ev_arjun_july.id, parameter_id=p_init.id, score=0, comment="")
    ])

    # Priya's July evaluation of Sneha (submitted)
    ev_sneha_july = Evaluation(
        id="ev5",
        company_id="ashoka",
        employee_id="u3",
        manager_id="u1",
        month="July",
        year=2024,
        status=EvaluationStatus.submitted,
        due_date="2024-07-31",
        overall_score=4.8
    )
    db.add(ev_sneha_july)
    db.flush()
    db.add_all([
        DimensionScore(evaluation_id=ev_sneha_july.id, parameter_id=p_own.id, score=5, comment="Sneha drives design initiatives independently, maintaining standard-setting quality across teams."),
        DimensionScore(evaluation_id=ev_sneha_july.id, parameter_id=p_comm.id, score=5, comment="Highly polished communications. Clear, constructive coaching feedback provided to her team."),
        DimensionScore(evaluation_id=ev_sneha_july.id, parameter_id=p_qual.id, score=5, comment="Her high-fidelity design work is flawless. Exceptionally structured tokens and layouts."),
        DimensionScore(evaluation_id=ev_sneha_july.id, parameter_id=p_collab.id, score=4, comment="Coordinated brilliantly between product management and engineering teams."),
        DimensionScore(evaluation_id=ev_sneha_july.id, parameter_id=p_init.id, score=5, comment="Proactively set up our brand design system guidelines, dramatically improving design velocity.")
    ])

    # Priya's June evaluation of Sampath (locked)
    ev_sampath_june = Evaluation(
        id="ev6",
        company_id="ashoka",
        employee_id="u7",
        manager_id="u1",
        month="June",
        year=2024,
        status=EvaluationStatus.locked,
        due_date="2024-06-30",
        overall_score=4.4
    )
    db.add(ev_sampath_june)
    db.flush()
    db.add_all([
        DimensionScore(evaluation_id=ev_sampath_june.id, parameter_id=p_own.id, score=5, comment="Sampath displayed absolute ownership during our high-performance dashboard refactoring."),
        DimensionScore(evaluation_id=ev_sampath_june.id, parameter_id=p_comm.id, score=4, comment="Articulates frontend architectures clearly during weekly review meetings."),
        DimensionScore(evaluation_id=ev_sampath_june.id, parameter_id=p_qual.id, score=4, comment="Code was clean, modular, and optimized. Excellent styling pattern adherence."),
        DimensionScore(evaluation_id=ev_sampath_june.id, parameter_id=p_collab.id, score=5, comment="Spent extra time pair-programming to help onboard our junior developers."),
        DimensionScore(evaluation_id=ev_sampath_june.id, parameter_id=p_init.id, score=4, comment="Spearheaded client-side bundle optimizations which cut initial load times by 30%.")
    ])

    # --- BRIGHT PATH EVALUATIONS ---
    ev_bp_divya_july = Evaluation(
        id="ev_bp1",
        company_id="brightpath",
        employee_id="b2",
        manager_id="b1",
        month="July",
        year=2024,
        status=EvaluationStatus.draft,
        due_date="2024-07-31"
    )
    db.add(ev_bp_divya_july)
    db.flush()
    db.add_all([
        DimensionScore(evaluation_id=ev_bp_divya_july.id, parameter_id=p_own.id, score=4, comment="Divya took ownership of client advisory deliverables."),
        DimensionScore(evaluation_id=ev_bp_divya_july.id, parameter_id=p_comm.id, score=0, comment=""),
        DimensionScore(evaluation_id=ev_bp_divya_july.id, parameter_id=p_qual.id, score=0, comment=""),
        DimensionScore(evaluation_id=ev_bp_divya_july.id, parameter_id=p_collab.id, score=0, comment=""),
        DimensionScore(evaluation_id=ev_bp_divya_july.id, parameter_id=p_init.id, score=0, comment="")
    ])

    db.commit()
    logger.info("Database seeding successfully completed!")

if __name__ == "__main__":
    db = SessionLocal()
    try:
        seed_db(db)
    finally:
        db.close()
