using UnityEngine;

namespace NotebookWar.AI
{
    public class EngageState : IEnemyState
    {
        private EnemyBase enemy;
        private float engageDistance = 6f;
        private float retreatHealthThreshold = 0.3f;

        public EngageState(EnemyBase enemyBase)
        {
            enemy = enemyBase;
        }

        public void Enter()
        {
            // Stop moving and prepare for combat
            enemy.StopMoving();
        }

        public void Update()
        {
            // Check if should retreat due to low health
            if (enemy.GetHealthPercentage() <= retreatHealthThreshold)
            {
                // Transition to retreat state - will need state machine reference
                return;
            }

            // Check if player is still visible
            if (!enemy.CanSeePlayer())
            {
                // Transition to investigate state - will need state machine reference
                return;
            }

            // Face the player
            FacePlayer();

            // Manage distance to player
            float distanceToPlayer = Vector3.Distance(enemy.transform.position, enemy.GetPlayer().position);

            if (distanceToPlayer > enemy.GetAttackRange())
            {
                // Move closer to attack range
                MoveTowardsPlayer();
            }
            else if (distanceToPlayer < engageDistance * 0.5f)
            {
                // Too close, back away slightly
                MoveAwayFromPlayer();
            }
            else
            {
                // In optimal range, stop and attack
                enemy.StopMoving();
                
                if (enemy.CanAttack())
                {
                    enemy.Attack();
                }
            }
        }

        public void Exit()
        {
            enemy.StopMoving();
        }

        private void FacePlayer()
        {
            if (enemy.GetPlayer() == null) return;

            Vector3 direction = (enemy.GetPlayer().position - enemy.transform.position).normalized;
            direction.y = 0; // Keep on horizontal plane
            
            if (direction != Vector3.zero)
            {
                Quaternion targetRotation = Quaternion.LookRotation(direction);
                enemy.transform.rotation = Quaternion.Slerp(
                    enemy.transform.rotation, 
                    targetRotation, 
                    5f * Time.deltaTime
                );
            }
        }

        private void MoveTowardsPlayer()
        {
            if (enemy.GetPlayer() == null) return;
            
            Vector3 targetPosition = enemy.GetPlayer().position;
            enemy.MoveTo(targetPosition);
        }

        private void MoveAwayFromPlayer()
        {
            if (enemy.GetPlayer() == null) return;

            Vector3 directionAway = (enemy.transform.position - enemy.GetPlayer().position).normalized;
            Vector3 retreatPosition = enemy.transform.position + directionAway * 3f;
            
            enemy.MoveTo(retreatPosition);
        }
    }
}