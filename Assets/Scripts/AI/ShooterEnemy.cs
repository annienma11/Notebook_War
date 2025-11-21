using UnityEngine;
using NotebookWar.Weapons;

namespace NotebookWar.AI
{
    public class ShooterEnemy : EnemyBase
    {
        [Header("Shooter Specific")]
        [SerializeField] private Transform firePoint;
        [SerializeField] private float shootingRange = 20f;
        [SerializeField] private float fireRate = 1f;
        [SerializeField] private LayerMask shootLayers;
        
        private float nextFireTime;
        private EnemyStateMachine stateMachine;

        protected override void InitializeStateMachine()
        {
            stateMachine = new EnemyStateMachine(this);
        }

        protected override void Update()
        {
            base.Update();
            HandleStateTransitions();
        }

        private void HandleStateTransitions()
        {
            var currentState = stateMachine.GetCurrentState();
            
            if (currentState is PatrolState && CanSeePlayer())
            {
                stateMachine.ChangeState(new ShooterEngageState(this));
            }
            else if (currentState is ShooterEngageState)
            {
                if (GetHealthPercentage() <= 0.2f)
                    stateMachine.ChangeState(new RetreatState(this));
                else if (!CanSeePlayer())
                    stateMachine.ChangeState(new InvestigateState(this));
            }
        }

        protected override void PerformAttack()
        {
            if (Time.time < nextFireTime || player == null) return;
            
            nextFireTime = Time.time + fireRate;
            
            Vector3 direction = (player.position - firePoint.position).normalized;
            
            if (Physics.Raycast(firePoint.position, direction, out RaycastHit hit, shootingRange, shootLayers))
            {
                IDamageable damageable = hit.collider.GetComponent<IDamageable>();
                if (damageable != null)
                {
                    damageable.TakeDamage(damage);
                }
            }
        }

        public float GetShootingRange() => shootingRange;
        public EnemyStateMachine GetStateMachine() => stateMachine;
    }

    public class ShooterEngageState : IEnemyState
    {
        private ShooterEnemy enemy;
        private float optimalRange = 15f;

        public ShooterEngageState(ShooterEnemy shooterEnemy)
        {
            enemy = shooterEnemy;
        }

        public void Enter()
        {
            enemy.StopMoving();
        }

        public void Update()
        {
            if (enemy.GetPlayer() == null) return;

            FacePlayer();
            
            float distance = Vector3.Distance(enemy.transform.position, enemy.GetPlayer().position);
            
            if (distance > enemy.GetShootingRange())
            {
                MoveTowardsPlayer();
            }
            else if (distance < optimalRange * 0.7f)
            {
                MoveAwayFromPlayer();
            }
            else
            {
                enemy.StopMoving();
                if (enemy.CanAttack())
                    enemy.Attack();
            }
        }

        public void Exit()
        {
            enemy.StopMoving();
        }

        private void FacePlayer()
        {
            Vector3 direction = (enemy.GetPlayer().position - enemy.transform.position).normalized;
            direction.y = 0;
            
            if (direction != Vector3.zero)
            {
                Quaternion targetRotation = Quaternion.LookRotation(direction);
                enemy.transform.rotation = Quaternion.Slerp(enemy.transform.rotation, targetRotation, 8f * Time.deltaTime);
            }
        }

        private void MoveTowardsPlayer()
        {
            enemy.MoveTo(enemy.GetPlayer().position);
        }

        private void MoveAwayFromPlayer()
        {
            Vector3 direction = (enemy.transform.position - enemy.GetPlayer().position).normalized;
            Vector3 retreatPos = enemy.transform.position + direction * 5f;
            enemy.MoveTo(retreatPos);
        }
    }
}