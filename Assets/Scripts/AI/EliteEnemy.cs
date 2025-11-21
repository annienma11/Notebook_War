using UnityEngine;

namespace NotebookWar.AI
{
    public class EliteEnemy : EnemyBase
    {
        [Header("Elite Specific")]
        [SerializeField] private float flankDistance = 8f;
        [SerializeField] private float flankSpeed = 1.5f;
        
        private EnemyStateMachine stateMachine;
        private Vector3 flankTarget;

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
                stateMachine.ChangeState(new FlankState(this));
            }
            else if (currentState is FlankState)
            {
                if (GetHealthPercentage() <= 0.3f)
                    stateMachine.ChangeState(new RetreatState(this));
                else if (!CanSeePlayer())
                    stateMachine.ChangeState(new InvestigateState(this));
            }
        }

        protected override void PerformAttack()
        {
            if (player == null) return;
            
            float distance = Vector3.Distance(transform.position, player.position);
            if (distance <= attackRange)
            {
                IDamageable damageable = player.GetComponent<IDamageable>();
                if (damageable != null)
                {
                    damageable.TakeDamage(damage * 1.2f); // Elite does more damage
                }
            }
        }

        public Vector3 CalculateFlankPosition()
        {
            if (player == null) return transform.position;
            
            Vector3 playerPos = player.position;
            Vector3 toPlayer = (playerPos - transform.position).normalized;
            Vector3 flankDirection = Vector3.Cross(toPlayer, Vector3.up).normalized;
            
            // Randomly choose left or right flank
            if (Random.value > 0.5f)
                flankDirection = -flankDirection;
            
            return playerPos + flankDirection * flankDistance;
        }

        public float GetFlankSpeed() => moveSpeed * flankSpeed;
        public EnemyStateMachine GetStateMachine() => stateMachine;
    }

    public class FlankState : IEnemyState
    {
        private EliteEnemy enemy;
        private Vector3 flankPosition;
        private bool hasReachedFlank = false;

        public FlankState(EliteEnemy eliteEnemy)
        {
            enemy = eliteEnemy;
        }

        public void Enter()
        {
            flankPosition = enemy.CalculateFlankPosition();
            enemy.GetAgent().speed = enemy.GetFlankSpeed();
            enemy.MoveTo(flankPosition);
            hasReachedFlank = false;
        }

        public void Update()
        {
            if (!hasReachedFlank)
            {
                if (HasReachedFlankPosition())
                {
                    hasReachedFlank = true;
                    enemy.StopMoving();
                }
            }
            else
            {
                // Attack from flank position
                if (enemy.IsPlayerInAttackRange() && enemy.CanAttack())
                {
                    enemy.Attack();
                }
                else
                {
                    // Recalculate flank if player moved
                    Vector3 newFlank = enemy.CalculateFlankPosition();
                    if (Vector3.Distance(flankPosition, newFlank) > 3f)
                    {
                        flankPosition = newFlank;
                        enemy.MoveTo(flankPosition);
                        hasReachedFlank = false;
                    }
                }
            }
        }

        public void Exit()
        {
            enemy.GetAgent().speed = enemy.moveSpeed;
            enemy.StopMoving();
        }

        private bool HasReachedFlankPosition()
        {
            return Vector3.Distance(enemy.transform.position, flankPosition) < 1.5f;
        }
    }
}