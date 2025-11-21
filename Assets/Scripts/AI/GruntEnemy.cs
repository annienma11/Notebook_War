using UnityEngine;
using NotebookWar.Weapons;

namespace NotebookWar.AI
{
    public class GruntEnemy : EnemyBase
    {
        [Header("Grunt Specific")]
        [SerializeField] private float meleeRange = 2f;
        [SerializeField] private GameObject attackEffect;
        
        private EnemyStateMachine stateMachine;

        protected override void InitializeStateMachine()
        {
            stateMachine = new EnemyStateMachine(this);
        }

        protected override void Start()
        {
            base.Start();
            stateMachine?.Start();
        }

        protected override void Update()
        {
            if (isDead) return;
            
            stateMachine?.Update();
            HandleStateTransitions();
        }

        private void HandleStateTransitions()
        {
            var currentState = stateMachine.GetCurrentState();
            
            if (currentState is PatrolState)
            {
                if (CanSeePlayer())
                {
                    stateMachine.ChangeState(new InvestigateState(this));
                }
            }
            else if (currentState is InvestigateState)
            {
                if (CanSeePlayer())
                {
                    stateMachine.ChangeState(new EngageState(this));
                }
                else
                {
                    // Check if investigation time is up (handled in state)
                    // For now, return to patrol after some time
                }
            }
            else if (currentState is EngageState)
            {
                if (GetHealthPercentage() <= 0.3f)
                {
                    stateMachine.ChangeState(new RetreatState(this));
                }
                else if (!CanSeePlayer())
                {
                    stateMachine.ChangeState(new InvestigateState(this));
                }
            }
            else if (currentState is RetreatState)
            {
                // Handled in retreat state
            }
        }

        protected override void PerformAttack()
        {
            if (player == null) return;

            // Check if player is in melee range
            float distanceToPlayer = Vector3.Distance(transform.position, player.position);
            if (distanceToPlayer <= meleeRange)
            {
                // Deal damage to player
                IDamageable playerDamageable = player.GetComponent<IDamageable>();
                if (playerDamageable != null)
                {
                    playerDamageable.TakeDamage(damage);
                }

                // Show attack effect
                if (attackEffect != null)
                {
                    GameObject effect = Instantiate(attackEffect, transform.position + transform.forward, transform.rotation);
                    Destroy(effect, 1f);
                }
            }
        }

        protected override void OnDamageTaken(float damage)
        {
            // Grunt becomes more aggressive when damaged
            if (stateMachine.GetCurrentState() is PatrolState)
            {
                stateMachine.ChangeState(new InvestigateState(this));
            }
        }

        protected override void OnDeath()
        {
            // Death effects for grunt
            // Could spawn particles, play sound, etc.
        }

        public EnemyStateMachine GetStateMachine() => stateMachine;

        protected override void OnDrawGizmosSelected()
        {
            base.OnDrawGizmosSelected();
            
            // Draw melee range
            Gizmos.color = Color.magenta;
            Gizmos.DrawWireSphere(transform.position, meleeRange);
        }
    }
}